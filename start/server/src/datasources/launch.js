const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllLaunches() {
        const res = await this.get('launches');
        return res && res.length ? res.map(l => this.launchReducer(l)) : [];
    }

    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }

    async getLaunchByID({ launchID }) {
        const res = await this.get('launches', { flight_number: launchID });
        return this.launchReducer(res[0]);
    }

    async getLaunchesByIDs({ launchIDs }) {
        return Promise.all(
            launchIDs.map(launchID => this.getLaunchByID({ launchID })),
        );
    }

}

module.exports = LaunchAPI;

