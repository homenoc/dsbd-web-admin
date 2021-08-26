const Config = () => {
    if (process.env.REACT_APP_NODE_ENV === 'staging') {
        // staging
        return {
            restful: {
                apiURL: process.env.REACT_APP_STG_API_URL,
                wsURL: process.env.REACT_APP_STG_WS_URL,
                notifyEMail: process.env.REACT_APP_STG_NOTIFY_EMAIL
            }
        }
    } else if (process.env.REACT_APP_NODE_ENV === 'prod') {
        // production
        return {
            restful: {
                apiURL: process.env.REACT_APP_PROD_API_URL,
                wsURL: process.env.REACT_APP_PROD_WS_URL,
                notifyEMail: process.env.REACT_APP_PROD_NOTIFY_EMAIL
            }
        }
    } else {
        // development
        return {
            restful: {
                apiURL: process.env.REACT_APP_DEV_API_URL,
                wsURL: process.env.REACT_APP_DEV_WS_URL,
                notifyEMail: process.env.REACT_APP_DEV_NOTIFY_EMAIL
            }
        }
    }
}

export const restfulApiConfig = Config().restful
