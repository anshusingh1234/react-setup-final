import React from "react";

const authContext = React.createContext({
    authenticated: false,
    sendAnalytics: () => {}
});

export default authContext;