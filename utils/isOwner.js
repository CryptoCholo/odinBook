exports.isOwner = (reqId, resId) => {
       let stringId = resId.toString();

    const allowed = reqId === stringId;

    console.log( reqId,  stringId, allowed)

    return allowed;
}