import { authRoles } from 'app/auth';
const navigationConfig = [

    /** Admin Navigation */
    {
        'id': 'dashboard_aadmin',
        'title': 'Tableaux de bord',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'dashboard',
        'url': '/dashboard'
    },
    {
        'id': 'demandes-admin',
        'title': 'Gestion des RFQs',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'inbox',
        'url': '/demandes_admin',
        'badge': {
            'title': 'demandes-admin',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }
    },
    {
        'id': 'demandes-devis',
        'title': 'Demandes de devis',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'inbox',
        'url': '/demandes_devis',
        'badge': {
            'title': 'demandes-devis',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }
    },
    {
        'id': 'message-fournisseur',
        'title': 'Destination Fournisseur',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'email',
        'url': '/contact_fournisseur',
        'badge': {
            'title': 'message-fournisseur',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }
    },
    {
        'id': 'validation_produits',
        'title': 'Validation des Produits',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'shopping_cart',
        'url': '/products',
        'badge': {
            'title': 'validation_produits',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }

    },
    {
        'id': 'acheteur-admin',
        'title': 'Acheteurs',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'supervisor_account',
        'url': '/users/acheteurs',
        'badge': {
            'title': 'acheteur-admin',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }
    },
    {
        'id': 'fournisseurs-admin',
        'title': 'Fournisseurs',
        'auth': authRoles.admin,
        'type': 'item',
        'icon': 'supervisor_account',
        'url': '/users/fournisseurs',
        'badge': {
            'title': 'fournisseurs-admin',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        },
    },
    {
        'id': 'utilisateurs',
        'title': 'Utilisateur',
        'auth': authRoles.admin,
        'type': 'group',
        'icon': 'build',
        'children': [
            {
                'id': 'users',
                'title': 'Gestion des utilisateurs',
                'type': 'collapse',
                'icon': 'group',
                'children': [


                    {
                        'id': 'admins-component',
                        'title': 'Admins',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'verified_user',
                        'url': '/users/admin',
                    },
                    {
                        'id': 'zones-component',
                        'title': 'Admins Comm.',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'group',
                        'url': '/users/zones',
                    },
                    {
                        'id': 'commercial-component',
                        'title': 'Commercials',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'group',
                        'url': '/users/commercials',
                    },

                ]
            },

        ]
    },
    {
        'id': 'lesachatsindustriels',
        'title': 'Abonnements',
        'type': 'group',
        'auth': authRoles.admin,
        'children': [
            {

                'id': 'abonnement-fournisseur',
                'title': 'Fournisseurs',
                'type': 'collapse',
                'icon': 'work_outline',
                'badge': {
                    'title': 'abonnement-fournisseur',
                    'bg': 'rgb(255, 111, 0)',
                    'fg': '#FFFFFF',
                    'count': 0
                },
                'children': [
                    {
                        'id': 'commandes-abonnements',
                        'title': 'Commandes abonnement',
                        'type': 'item',
                        'auth': authRoles.admin,
                        'icon': 'inbox',
                        'url': '/admin/offres/commande',
                        'badge': {
                            'title': 'commandes-abonnements',
                            'bg': 'rgb(255, 111, 0)',
                            'fg': '#FFFFFF',
                            'count': 0
                        }

                    },
                    {
                        'id': 'gestion-abonnements',
                        'title': 'Abonnements',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'cloud',
                        'url': '/admin/offres/abonnement',

                    },
                    {
                        'id': 'commandes-jetons',
                        'title': 'Commandes jetons',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'control_point_duplicate',
                        'url': '/admin/abonnement/commandes',
                        'badge': {
                            'title': 'commandes-jetons',
                            'bg': 'rgb(255, 111, 0)',
                            'fg': '#FFFFFF',
                            'count': 0
                        }
                    },
                    {
                        'id': 'fournisseur-jetons',
                        'title': 'Gestion des jetons',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'icon': 'monetization_on',
                        'url': '/admin/abonnement/jetons',
                    },

                ]

            },

        ]
    },
    {
        'id': 'configurer',
        'title': 'Configurer',
        'type': 'group',
        'auth': authRoles.admin,
        'icon': 'build',
        'children': [
            {
                'id': 'portail',
                'title': 'Gestion du contenu',
                'type': 'collapse',
                'icon': 'apps',
                'children': [
                    {
                        'id': 'actualites-admin',
                        'title': 'Actualités',
                        'type': 'item',
                        'icon': 'ballot',
                        'auth': authRoles.admin,
                        'url': '/admin/actualites',
                    },

                    {
                        'id': 'produits-admin',
                        'title': 'Focus produits',
                        'type': 'item',
                        'icon': 'ballot',
                        'auth': authRoles.admin,
                        'url': '/admin/focus-produits',
                    },
                    {
                        'id': 'condition-admin',
                        'title': 'Conditions Générales',
                        'type': 'item',
                        'icon': 'ballot',
                        'auth': authRoles.admin,
                        'url': '/admin/conditions',
                    },
                    {
                        'id': 'faqs',
                        'title': 'FAQ',
                        'type': 'collapse',
                        'icon': 'help_outline',
                        'children': [
                            {
                                'id': 'faqsCat-admin',
                                'title': 'Catégories',
                                'type': 'item',
                                'auth': authRoles.admin,
                                'url': '/admin/faqCategories',
                            },
                            {
                                'id': 'faqs-admin',
                                'title': 'FAQ',
                                'type': 'item',
                                'auth': authRoles.admin,
                                'url': '/admin/faqs',
                            },

                        ]
                    },

                ]
            },
            {
                'id': 'parametre',
                'title': 'Paramètres',
                'type': 'collapse',
                'icon': 'build',
                'children': [
                    {
                        'id': 'suggestions-component',
                        'title': 'Suggestions',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'url': '/parametres/suggestions',
                    },
                    {
                        'id': 'pays-component',
                        'title': 'Pays',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'url': '/parametres/pays',
                    },
                    {
                        'id': 'villes-component',
                        'title': 'Villes',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'url': '/parametres/villes',
                    },
                    {
                        'id': 'secturs-component',
                        'title': 'Secteurs',
                        'auth': authRoles.admin,
                        'type': 'item',
                        'url': '/parametres/secteurs',
                    },
                    {
                        'id': 'sous_secturs-component',
                        'title': 'Sous-Secteurs',
                        'type': 'item',
                        'auth': authRoles.admin,
                        'url': '/parametres/sous_secteurs',
                    },
                    {
                        'id': 'categories-component',
                        'title': 'Produits',
                        'type': 'item',
                        'auth': authRoles.admin,
                        'url': '/parametres/categories',
                    },
                    {
                        'id': 'motifs-component',
                        'title': 'Motifs du rejet',
                        'type': 'item',
                        'auth': authRoles.admin,
                        'url': '/parametres/motifs',
                    }
                ]
            },

        ]
    },


    /** Fin Admin Navigation */

    /** ACHETEUR Navigations */
    {
        'id': 'dashboard_ac',
        'title': 'Tableaux de bord',
        'auth': authRoles.acheteur,
        'type': 'item',
        'icon': 'dashboard',
        'url': '/dashboard'
    },
    {
        'id': 'demandes-acheteur',
        'title': 'Demandes de devis',
        'auth': authRoles.acheteur,
        'icon': 'inbox',
        'type': 'collapse',
        'children': [
            {
                'id': 'demande_nv',
                'title': 'Nouvelle demande',
                'auth': authRoles.acheteur,
                'exact': true,
                'type': 'item',
                'url': '/demandes/new'
            },
            {
                'id': 'demandes_ha',
                'title': 'Liste des demandes',
                'auth': authRoles.acheteur,
                'exact': true,
                'type': 'item',
                'url': '/demandes'
            },

        ]
    },

    {
        'id': 'black_listes_ha',
        'title': 'Blacklistes',
        'auth': authRoles.acheteur,
        'type': 'item',
        'icon': 'work_off',
        'url': '/blacklistes'
    },
    {
        'id': 'mon_profil',
        'title': 'Profil',
        'auth': authRoles.acheteur,
        'type': 'item',
        'icon': 'person',
        'url': '/ac/profile'
    },
    /** FIN ACHETEUR Navigations */



    /** FOURNISSEUR Navigations */
    {
        'id': 'dashboard_fr',
        'title': 'Tableaux de bord',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'dashboard',
        'url': '/dashboard'
    },
    {
        'id': 'demandes_prix',
        'title': 'Demande de prix',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'inbox',
        'url': '/demandes_prix',
        'badge': {
            'title': 'demandes_prix',
            'bg': 'rgb(9, 210, 97)',
            'fg': '#FFFFFF',
            'count': 0
        }
    },
    {
        'id': 'mes_consultations',
        'title': 'Consultations',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'move_to_inbox',
        'url': '/consultations',

    },
    {
        'id': 'produits-fournisseur',
        'title': 'Produits',
        'auth': authRoles.fournisseur,
        'type': 'collapse',
        'icon': 'local_offer',
        'children': [
            {
                'id': 'nv_produit',
                'title': 'Nouveau produit',
                'auth': authRoles.fournisseur,
                'exact': true,
                'type': 'item',
                'url': '/produits/new',

            },
            {
                'id': 'mes_produits',
                'title': 'Liste des produits',
                'auth': authRoles.fournisseur,
                'exact': true,
                'type': 'item',
                'url': '/produits',

            },

            {
                'id': 'product-devis',
                'title': 'Demandes de devis',
                'auth': authRoles.fournisseur,
                'type': 'item',
                'url': '/product_devis',
                'badge': {
                    'title': 'product-devis',
                    'bg': 'rgb(255, 111, 0)',
                    'fg': '#FFFFFF',
                    'count': 0
                }
            },
        ]
    },


    {
        'id': 'messages',
        'title': 'Messages',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'email',
        'url': '/messages',
        'badge': {
            'title': 'messages',
            'bg': 'rgb(255, 111, 0)',
            'fg': '#FFFFFF',
            'count': 0
        }

    },
    {
        'id': 'fr_profil',
        'title': 'Profil',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'person',
        'url': '/user/profile'
    },
    {
        'id': 'personnels-component',
        'title': 'Personnels',
        'auth': authRoles.fournisseur,
        'type': 'item',
        'icon': 'group',
        'url': '/fournisseur/personnel',
    },
    {

        'id': 'abonnement',
        'title': 'Les achats industriels',
        'type': 'collapse',
        'auth': authRoles.fournisseur,
        'icon': 'cloud',
        'children': [
            {
                'id': 'offre-abonnement',
                'title': 'Abonnement',
                'type': 'item',
                'icon': 'cloud',
                'auth': authRoles.fournisseur,

                exact: true,
                'url': '/abonnement',
            },
            /* {
                 'id': 'offre-commandes',
                 'title': 'Vos commandes',
                 'type': 'item',
                 'auth': authRoles.fournisseur,
 
                 'icon': 'format_list_bulleted',
                 'url': '/offres/commande',
             },*/
            {
                'id': 'fr-commandes',
                'title': 'Jetons',
                'type': 'item',
                'auth': authRoles.fournisseur,

                'icon': 'control_point_duplicate',
                exact: true,
                'url': '/abonnement/commandes',
            },

        ]

    },
    /** FIN FOURNISSEUR Navigations */

];

export default navigationConfig;
