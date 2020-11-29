import types from "./types";

export function loadBigStory(id, type) {
    return {
        CALL_API: [
            {
                type: types.FETCH_HOME_BIG_STORY,
                meta: {
                    path: "/staticbox/detail/"+id,
                    method: "GET",
                }
            }
        ]
    }
}