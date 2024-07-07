// app/main/acheteur/AcheteursPage.js

import React from 'react';
import CreateAcheteur from './CreateAcheteur';

const AcheteursPage = () => {
    return (
        <div>
            <h1>Gestion des Acheteurs</h1>
            <CreateAcheteur />
            {/* Vous pouvez ajouter ici d'autres composants ou fonctionnalités de gestion des acheteurs */}
        </div>
    );
};

export default AcheteursPage;
