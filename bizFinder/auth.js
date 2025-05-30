/** @odoo-module **/

import { registry } from "@web/core/registry";

const authService = {
    dependencies: ["rpc", "orm"],
    async: ['isSignedIn', 'signIn', 'signOut'],
    start(env, { rpc, orm }) {
        return {
            signedIn: null,
            async isSignedIn() {
                if(this.signedIn === null) {
                    this.signedIn = false;
                    try {
                        this.signedIn = await rpc('prospector_validate_token')
                    } catch (error) {
                        this.signedIn = false;
                    }
                
                    if(this.signedIn) {
                        this.signedIn = await orm.call('ucsmindbite_prospector_settings', 'hasApiKey', []);
                    }
                }
            
                return this.signedIn;
            },
            async signIn() {
                this.signedIn = null;
        
                let moxResponse = await rpc('/prospector_login')
                window.location.href = moxResponse.signInUrl
            },
            async signOut() {
                this.signedIn = null;
        
                const logoutResponse = await rpc('/prospector_logout')
                window.location.href = logoutResponse.redirect
            }
        };
    },
};

registry.category("services").add("ucs_prospector_auth", authService);