import requests
from requests.auth import HTTPBasicAuth

import logging
_logger = logging.getLogger(__name__)

class ProspectorClient():
    def __init__(self, env):
        self.env = env
        model = self.env["ucsmindbite_prospector_settings"]
        db_settings = model.search_read([], order='create_date desc', limit=1)

        self.bizMatchDomain = 'https://prospector.ucsmindbite.cloud'

        if len(db_settings) > 0:
            self.client_id = db_settings[0]["api_client_id"]
            self.client_secret = db_settings[0]["api_client_secret"]
    
    def get_search_filters(self):
        api_response = requests.get('%s/api/insight/filters' % self.bizMatchDomain, auth=(self.client_id, self.client_secret))
        return api_response.json()
    
    def get_landing_page_information(self):
        api_response = requests.get('%s/api/information/landingpage' % self.bizMatchDomain)
        print(api_response)
        return api_response.json()
    
    def get_ai_search_information(self):
        api_response = requests.get('%s/api/information/aiSearch' % self.bizMatchDomain)
        return api_response.json()

    def get_ai_prompt_filters(self, prompt):
        api_response = requests.get('%s/api/insight/AIFilters?prompt=%s' % (self.bizMatchDomain, requests.utils.quote(prompt)), auth=(self.client_id, self.client_secret))
        print(api_response)
        return api_response.json()

    def preview_filter_results(self, data):
        api_response = requests.post('%s/api/insight/filters' % self.bizMatchDomain, json=data, auth=(self.client_id, self.client_secret))
        return api_response.json()
    
    def get_filter_results(self, data):
        api_response = requests.post('%s/api/insight/prospects?skip=0&take=2500' % self.bizMatchDomain, json=data, auth=(self.client_id, self.client_secret))
        return api_response.json()

    def validate_access_token(self):
        if not hasattr(self, 'client_id') or not hasattr(self, 'client_secret'):
            return False

        api_response = requests.get('%s/api/insight/validatelogin' % self.bizMatchDomain, auth=(self.client_id, self.client_secret), allow_redirects = False)
        return api_response.status_code == 200
    
    def create_leads(self, customers, company_id):
        api_response = requests.post('%s/api/insight/leads' % self.bizMatchDomain, json=len(customers), auth=(self.client_id, self.client_secret))
        for customer in customers:
            self.create_lead(customer, company_id)
        return True

    def create_customers(self, customers, company_id):
        for customer in customers:
            self.create_customer(customer, company_id)
        return True

    def create_customer(self, customer, company_id):
        obj = {
            'company_id': company_id,
            'name': customer['name'],
            'phone': customer['phone'],
            'vat': customer['vatNumber'],
            'street': customer['address'],
            'zip': customer['postCode'],
            'city': customer['city'], 
            'commercial_company_name': customer['name'],
            'type': 'contact',
            'lang': 'en_US',
            'active': True,
            'is_company': True,
            'partner_share': True,
        }

        orgNumberFieldName, = self.env["ir.config_parameter"].sudo().get_param("partner_orgnumber_field_name"),

        if orgNumberFieldName:
            obj[orgNumberFieldName] = customer["organisationNumber"]

        self.env['res.partner'].create(obj)

        return customer
    
    def create_lead(self, customer, company_id):
        description = self.structure_description(customer)
        obj = {
            'company_id': company_id,
            'name': customer['name'],
            'partner_name': customer['name'],
            'phone_sanitized': customer['phone'],
            'phone': customer['phone'],
            'company_vat_number': customer['vatNumber'],
            'company_organisation_number': customer['organisationNumber'],
            'company_employees': customer['employees'],
            'company_turnover': customer['turnOver'],
            'company_legal_entity': customer['legalEntity'],
            'street': customer['address'],
            'zip': customer['postCode'],
            'city': customer['city'],
            
            'country_id': 196,
            'contact_name': '',
            'priority': 0,
            'type': 'lead',
            'referred': 'BizMatch',
            'stage_id': 1,
            'active': True,
            'description': description,
        }

        self.env['crm.lead'].create(obj)

        return customer
    
    def temp(self, customer):
        description = ""
        for key, value in customer.items():
            description += f"{key}: {value}\n"
        return description

    def customer_exists(self, vat_number):
        customer_exists = self.env['res.partner'].search([('vat', '=', vat_number)], limit=1)
        return customer_exists
    
    def get_all_organisation_numbers(self):
        partners = self.env['res.partner'].search([('company_registry', '!=', '')])
        org_numbers = partners.mapped('company_registry')
        return org_numbers  
    
    def get_all_lead_organisation_numbers(self):
        try:
            _logger.info("Searching for leads with organisation numbers")
            leads = self.env['crm.lead'].search([('company_organisation_number', '!=', False)])
            _logger.info("Found %d leads with organisation numbers", len(leads))
            org_numbers = leads.mapped('company_organisation_number')
            _logger.info("Retrieved organisation numbers: %s", org_numbers)
            return org_numbers
        except Exception as e:
            _logger.error("Error in get_all_lead_organisation_numbers: %s", str(e))
            return []

    def my_account_details(self):        
        api_response = requests.get('%s/api/insight/account' % self.bizMatchDomain, auth=(self.client_id, self.client_secret), allow_redirects = False)
        return api_response.json()
    
    def structure_description(self, customer):
        description = f"""
        <h3>Extra information</h3>
        <table border="1" cellpadding="4" cellspacing="0">
        <tr><th>Kategori</th><th>Information</th></tr>
        <tr><td>Name</td><td>{customer['name']}</td></tr>
        <tr><td>Organisation Number</td><td>{customer['organisationNumber']}</td></tr>
        <tr><td>Beskrivning</td><td>{customer['description']}</td></tr>
        <tr><td>Anställda</td><td>{customer['employees']}</td></tr>
        <tr><td>Omsättning</td><td>{customer['turnOver']}</td></tr>
        <tr><td>Bolagsform</td><td>{customer['legalEntity']}</td></tr>
        <tr><td>VAT Number</td><td>{customer['vatNumber']}</td></tr>
        </table>
        """

        return description
        

