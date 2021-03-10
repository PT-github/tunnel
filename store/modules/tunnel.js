import Service from "~/plugins/framework/core/service";
// import TwoDService from "~/services/_2d";

export default {
    state: {},

    getters: {},

    mutations: {},

    actions: {
        TUNNEL_DEVICES({commit}, tunnelId) {
            if (!tunnelId) return
            console.log(Service)
            // Service.get({
            //     url: '/tunnel/rest/2d/getTunnelDeviceVideo',
            //     data: {
            //         tunnelId
            //     }
            // }).then(res => {
            //     console.log(res)
            // })
        }

    }
}
