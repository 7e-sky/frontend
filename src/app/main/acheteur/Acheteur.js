// src/components/Acheteur.js

import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { ROLES } from '../config/acheteurConfig';

const Acheteur = ({ acheteur, addEnfant, promoteAcheteur }) => {
    return (
        <Card style={{ margin: '20px', padding: '20px' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {acheteur.nom} ({acheteur.role})
                </Typography>
                {acheteur.role === ROLES.ACHETEUR && (
                    <Button variant="contained" color="primary" onClick={() => promoteAcheteur(acheteur.id)}>
                        Promouvoir en Directeur des Achats
                    </Button>
                )}
                {acheteur.role === ROLES.DIRECTEUR_DES_ACHATS && (
                    <Button variant="contained" color="primary" onClick={() => addEnfant(acheteur.id)}>
                        Ajouter Enfant
                    </Button>
                )}
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                    {acheteur.enfants && acheteur.enfants.map((enfant) => (
                        <Acheteur key={enfant.id} acheteur={enfant} addEnfant={addEnfant} promoteAcheteur={promoteAcheteur} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Acheteur;
