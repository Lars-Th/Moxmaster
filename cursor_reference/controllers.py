from odoo import http
from odoo.http import request, route

import json
import requests
from ..services.prospector_client import ProspectorClient
from ..services.chatbot import generate_response
from ..services.quality import QualityController

import logging
_logger = logging.getLogger(__name__)


class UCSMBProspector(http.Controller):
    @http.route(['/prospector_login'], type='http', auth='user', csrf=False)
    def prospector_login(self):
        base_url = request.env['ir.config_parameter'].get_param('web.base.url')
        r = requests.post("https://prospector.ucsmindbite.cloud/mox/odooauth/auth/beginsignon", data={'redirecturl': base_url + '/prospector_post_login', 'db': 'odoo', 'username': 'admin'})
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": r.json()
        })

    @http.route(['/prospector_logout'], type='http', auth='user', csrf=False)
    def prospector_logout(self):
        model = request.env["ucsmindbite_prospector_settings"]
        settings = model.search([], limit=1)
        settings.unlink()

        action_id = request.env.ref('ucsmindbite_prospector.dashboard')
        action_id_menu =request.env.ref('ucsmindbite_prospector.menu_root')

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": { "redirect": '/web#action={}&menu_id={}'.format(action_id.id, action_id_menu.id) }
        })

    @http.route(['/prospector_post_login'], type='http', auth='user', csrf=False)
    def prospector_post_login(self):
        action_id = request.env.ref('ucsmindbite_prospector.dashboard')
        action_id_menu =request.env.ref('ucsmindbite_prospector.menu_root')

        data = request.get_http_params()
        model = request.env["ucsmindbite_prospector_settings"]
        allSettings = model.search_read([])

        if len(allSettings) == 0: 
            model.create([{'api_client_id': data["ClientId"], 'api_client_secret': data["ClientSecret"]}])
        else:
            model.write({'api_client_id': data["ClientId"], 'api_client_secret': data["ClientSecret"]})
             
        return request.make_response('', status=301, headers=[('Location', '/web#action={}&menu_id={}'.format(action_id.id, action_id_menu.id))])   

    @http.route(['/prospector_validate_token'], type='http', auth='user', csrf=False)
    def prospector_validate_token(self):
        pc = ProspectorClient(request.env)
        res = pc.validate_access_token()
        model = request.env["ucsmindbite_prospector_settings"]
        if not res:           
            settings = model.search([], limit=1)
            settings.unlink()

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 

    @http.route(['/prospector_get_search_filters'], type='http', auth='user', csrf=False)
    def prospector_get_search_filters(self):
        pc = ProspectorClient(request.env)
        res = pc.get_search_filters()
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 
    
    @http.route(['/get_landing_page_information'], type='http', auth='user', csrf=False)
    def get_landing_page_information(self):
        pc = ProspectorClient(request.env)
        res = pc.get_landing_page_information()
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 

    @http.route(['/get_ai_search_information'], type='http', auth='user', csrf=False)
    def get_ai_search_information(self):
        pc = ProspectorClient(request.env)
        res = pc.get_ai_search_information()
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 

    @http.route(['/prospector_preview_filter_results'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_preview_filter_results(self):
        data = json.loads(request.httprequest.data)

        paramList = convert_to_paramlist(data)

        pc = ProspectorClient(request.env)
        res = pc.preview_filter_results(paramList)
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 
    
    @http.route(['/prospector_filter_results'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_filter_results(self):
        data = json.loads(request.httprequest.data)

        paramList = convert_to_paramlist(data)

        pc = ProspectorClient(request.env)
        res = pc.get_filter_results(paramList)
        _logger.info("Target results: %s", res)

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        })

    @http.route(['/prospector_ai_prompt_filters'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_ai_prompt_filters(self):
        data = json.loads(request.httprequest.data)

        pc = ProspectorClient(request.env)
        res = pc.get_ai_prompt_filters(data.get('params')['prompt'])
        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        })
    
    @http.route(['/prospector_create_leads'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_create_leads(self):
        data = json.loads(request.httprequest.data)
        pc = ProspectorClient(request.env)
        res = pc.create_leads(data.get('params', []), try_get_company_id(request))

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 

    @http.route(['/prospector_get_all_organisation_numbers'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_get_all_organisation_numbers(self):
        data = json.loads(request.httprequest.data)
        pc = ProspectorClient(request.env)
        res = pc.get_all_organisation_numbers()

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 
    
    @http.route(['/prospector_get_all_lead_organisation_numbers'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_get_all_lead_organisation_numbers(self):
        data = json.loads(request.httprequest.data)
        pc = ProspectorClient(request.env)
        res = pc.get_all_lead_organisation_numbers()

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 
    
    @http.route(['/prospector_my_account'], type='http', auth='user', csrf=False)
    def prospector_my_account(self):
        pc = ProspectorClient(request.env)
        res = pc.my_account_details()

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        }) 
    
    @http.route(['/prospector_search_description'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_search_description(self):
        data = json.loads(request.httprequest.data)
        prompt = convert_to_prompt(data)
        res = generate_response(prompt)

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        })
    
    @http.route(['/prospector_quality_filter'], type='http', auth='user', csrf=False, methods=['POST'])
    def prospector_quality_filter(self):
        data = json.loads(request.httprequest.data)
        detailed_results = data["params"]["detailedResults"]
        filters = data["params"]["filters"]
        env = QualityController(detailed_results, filters)
        res = env.quality_data
        _logger.info("Quality Results: %s", res)

        return request.make_json_response({
            "jsonrpc": "2.0",
            "id": 0,
            "result": res
        })
    
def try_get_company_id(request):
    try: 
        return request.env.user.company_id.id
    except:
        return None

def try_to_int(strinValue):
    try:
        return int(strinValue)
    except:
        return None
    
def convert_to_paramlist(data):
    paramList = []

    for param in data["params"]:
        if param["type"] == 1:
            paramList.append({ 
                "filterCategory": param["filterCategory"],                    
                "SelectRange": { "min": try_to_int(param["value"]["min_value"]) , "max": try_to_int(param["value"]["max_value"])},
            })
        elif param["type"] == 0:
            paramList.append({ 
                "filterCategory": param["filterCategory"],
                "SelectOption":  [x["id"] for x in param["value"] if x["checked"]],
            })

    return paramList

def convert_to_prompt(data):
    prompt = ""
    
    for param in data["params"]:
        if param["type"] == 1:
            title = param["title"],
            value = ""
            if param["value"]["min_value"] == None:
                value = "Inget minsta värde"
            else:
                value += f"Minst, {param['value']['min_value']}"
            
            if param["value"]["max_value"] == None:
                value = "Inget högsta värde"
            else:
                value += f"Högst, {param['value']['max_value']}"
            
            prompt += f"{title}: {value}\n"

        elif param["type"] == 0:
            title = param["title"],
            value = ""
            for category in param["value"]:
                if (category["checked"]):
                    value += category["title"] + ", "

            if value == "":
                value="Inga begränsningar på detta filter"
            prompt += f"{title}: {value}\n"

    return prompt