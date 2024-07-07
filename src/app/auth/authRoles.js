/**
 * Authorization Roles
 */
const authRoles = {
    admin           : ['ROLE_ADMIN'],
    mediateur       : ['ROLE_Mediateur'],
    acheteur_pre    : ['ROLE_ACHETEUR_PRE'],
    acheteur        : ['ROLE_ACHETEUR'],
    fournisseur_pre : ['ROLE_FOURNISSEUR_PRE'],
    fournisseur     : ['ROLE_FOURNISSEUR'],
    registe         : ['ROLE_ACHETEUR', 'ROLE_FOURNISSEUR','ROLE_ADMIN','ROLE_Mediateur','ROLE_ZONE','ROLE_COMMERCIAL'],
    onlyGuest: []
};

export default authRoles;
