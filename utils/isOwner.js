exports.isOwner = (reqId, resId) => {
    const allowed = Number(reqId) == Number(resId);

    console.log(reqId, resId)

    return allowed;
}