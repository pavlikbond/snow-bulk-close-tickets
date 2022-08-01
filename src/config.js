export default {
    oidc: {
        issuer: "https://dev-72220652.okta.com/oauth2/default",
        clientId: "0oa5vdk22k9NIYD2S5d7",
        scopes: ["openid", "profile", "email", "authorization_code"],
        redirectUri: `${window.location.origin}/login/callback`,
    },
    widget: {
        issuer: "https://dev-72220652.okta.com/oauth2/default",
        clientId: "0oa5vdk22k9NIYD2S5d7",
        redirectUri: `${window.location.origin}/login/callback`,
        scopes: ["openid", "profile", "email", "authorization_code"],
        useInteractionCodeFlow: true,
    },
};
