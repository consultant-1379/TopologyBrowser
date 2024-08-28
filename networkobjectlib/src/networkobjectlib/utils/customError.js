/* eslint key-spacing:0 */
define([
    'i18n!networkobjectlib/dictionary.json'
], function(i18n) {

    /**
     * customError is an object that holds errors
     *
     * ### CustomError
     * [===
     *   {Number} code - error code
     *   {String} title - error title
     *   {String} message - error message
     *   {Object} extra - object with some extra information
     * ===]
     *
     * @class networkobjectlib/utils/customError
     */
    var customError = {
        // TODO -999 is only for legacy purpose, once all errors are introduced this one should be removed
        ServerRetrieveError:                        buildError(-999,    i18n.errors.persistentObjectError),
        PersistentObjectNotFound:                   buildError(10025,   i18n.errors.persistentObjectNotFound),
        UnknownServerError:                         buildError(-1,      i18n.errors.unknownServerError),
        ServiceUnavailable:                         buildError(10027,   i18n.errors.serviceUnavailable),
        NetworkObjectNotFound:                      buildError(1000,    i18n.errors.networkObjectNotFound),
        DatabaseUnavailable:                        buildError(10014,   i18n.errors.databaseUnavailable),
        Unauthorized:                               buildError(10019,   i18n.errors.unauthorized),
        AccessDenied:                               buildError(10015,   i18n.errors.forbidden),
        TBACPermissionDenied:                       buildError(10023,   i18n.errors.forbiddenTBAC),
        NodeBusy:                                   buildError(10017,   i18n.errors.nodeBusy),
        Timeout:                                    buildError(-2,      i18n.errors.timeout),
        SaveTimeout:                                buildError(-3,      i18n.errors.timeoutSave),
        CollectionNotFound:                         buildError(10007,   i18n.errors.collectionNotFound),
        SyncErrorFound:                             buildError(10021,   i18n.errors.SyncErrorFound),
        MemoryProtectionErrorDataRetrievalError:    buildError(10106,   i18n.errors.memoryProtectionDataRetrievalError),
        MemoryProtectionLocateObjectError:          buildError(10106,   i18n.errors.memoryProtectionLocateObjectError),
        TransactionError:                           buildError(1004,   i18n.errors.TransactionError),
        getError:               getError
    };

    return customError;

    function buildError(code, i18nError) {
        var error = function(title, extra) {
            this.code = code;
            this.title = title || i18nError.title || 'Error';
            this.message = i18nError.body || 'Some error occured';
            this.body = this.message;
            this.extra = extra || {};
        };

        error.code = code;

        return error;
    }

    function handleMemoryProtectionError(title, extra) {
        if (title && title.indexOf('Locate') > -1) {
            return new customError.MemoryProtectionLocateObjectError(title, extra);
        } else {
            return new customError.MemoryProtectionErrorDataRetrievalError(title, extra);
        }
    }

    function getError(code, title, extra) {
        switch (code) {
        case customError.MemoryProtectionErrorDataRetrievalError.code:
            return handleMemoryProtectionError(title, extra);
        case customError.UnknownServerError.code:
            return new customError.UnknownServerError(title, extra);
        case customError.Timeout.code:
            return new customError.Timeout(title, extra);
        case customError.SaveTimeout.code:
            return new customError.SaveTimeout(title, extra);
        case customError.PersistentObjectNotFound.code:
            return new customError.PersistentObjectNotFound(title, extra);
        case customError.ServiceUnavailable.code:
            return new customError.ServiceUnavailable(title, extra);
        case customError.NetworkObjectNotFound.code:
            return new customError.NetworkObjectNotFound(title, extra);
        case customError.DatabaseUnavailable.code:
            return new customError.DatabaseUnavailable(title, extra);
        case customError.AccessDenied.code:
            return new customError.AccessDenied(title, extra);
        case customError.Unauthorized.code:
            return new customError.Unauthorized(title, extra);
        case customError.TBACPermissionDenied.code:
            return new customError.TBACPermissionDenied(title, extra);
        case customError.NodeBusy.code:
            return new customError.NodeBusy(title, extra);
        case customError.CollectionNotFound.code:
            return new customError.CollectionNotFound(title, extra);
        case customError.SyncErrorFound.code:
            return new customError.SyncErrorFound(title, extra);
        case customError.TransactionError.code:
            return new customError.TransactionError(title, extra);
        default:
            // TODO default error should not be server related
            return new customError.ServerRetrieveError(title, extra);
        }
    }
});
