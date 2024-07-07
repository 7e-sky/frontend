import { demandeConfigs } from "./demande_achat/demandeConfigs";
import { BlackListesAppConfig } from "./black_liste/BlackListesAppConfig";
import { ProfileConfigs } from "./profile/ProfileConfigs";
import { DashboardAppConfig } from "./dashboard/DashboardAppConfig";
//import AcheteursPage from './AcheteursPage';
import { TeamsAppConfig } from "./Directeur_achat/TeamsAppConfig";
import { childsConfigs } from "./childs/childsConfigs";

export const acheteurConfigs = [
    demandeConfigs,
    BlackListesAppConfig,
    ProfileConfigs,
    TeamsAppConfig,
    childsConfigs,
   // AcheteursPage,
    DashboardAppConfig
];
