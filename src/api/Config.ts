const Config = () => {
    if (process.env.REACT_APP_NODE_ENV === 'staging') {
        // staging
        return {
            restful: {
                apiURL: process.env.REACT_APP_STG_API_URL,
                wsURL: process.env.REACT_APP_STG_WS_URL,
                notifyEMail: process.env.REACT_APP_STG_NOTIFY_EMAIL,
                initJPNICSearch:process.env.REACT_APP_STG_INIT_JPNIC_SEARCH
            }
        }
    } else if (process.env.REACT_APP_NODE_ENV === 'prod') {
        // production
        return {
            restful: {
                apiURL: process.env.REACT_APP_PROD_API_URL,
                wsURL: process.env.REACT_APP_PROD_WS_URL,
                notifyEMail: process.env.REACT_APP_PROD_NOTIFY_EMAIL,
                initJPNICSearch:process.env.REACT_APP_PROD_INIT_JPNIC_SEARCH
            }
        }
    } else {
        // development
        return {
            restful: {
                apiURL: process.env.REACT_APP_DEV_API_URL,
                wsURL: process.env.REACT_APP_DEV_WS_URL,
                notifyEMail: process.env.REACT_APP_DEV_NOTIFY_EMAIL,
                initJPNICSearch:process.env.REACT_APP_DEV_INIT_JPNIC_SEARCH
            }
        }
    }
}

export const restfulApiConfig = Config().restful
