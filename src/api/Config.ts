const Config = () => {
  return {
    restful: {
      apiURL: import.meta.env.VITE_API_URL,
      wsURL: import.meta.env.VITE_WS_URL,
      notifyEMail: import.meta.env.VITE_NOTIFY_EMAIL,
      initJPNICSearch: import.meta.env.VITE_INIT_JPNIC_SEARCH,
    },
  }
}

export const restfulApiConfig = Config().restful
