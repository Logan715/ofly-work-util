export const TYPE_ING = "TYPE_ING";
export const TYPE_SUCCESS = "TYPE_SUCCESS";
export const TYPE_FAIL = "TYPE_FAIL";

export const ing = (commit, ingType) => {
    commit(TYPE_ING, ingType);
};
export const success = (commit, type, data) => {
    commit(type, data);
};
export const fail = (commit, failType, failNote) => {
    commit(TYPE_FAIL, {
        type: failType,
        note: failNote
    });
};

export default {
    ing,
    success,
    fail,
    TYPE_ING,
    TYPE_SUCCESS,
    TYPE_FAIL
};
