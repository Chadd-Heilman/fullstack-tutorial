module.exports = {
    Query: {
        launches: async (_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchByID({ launchID: id }),
        me: async (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
    },
    Mission: {
        // make sure the default size is 'large' in case user doesn't specify
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size == 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
        },
    }
};