import axios from 'axios';
import React, { useState } from 'react';

 const CreateAcheteur = () => {
    const [formData, setFormData] = useState({
        societe: '',
        ice: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        del:false,
        confirmpassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Données à envoyer:', formData); // Log les données avant l'envoi
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/acheteurs', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Acheteur créé avec succès:', response.data);
        } catch (error) {
            console.error('Erreur lors de la création de l\'acheteur:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="societe" value={formData.societe} onChange={handleChange} placeholder="societe" required />
            <input type="text" name="ice" value={formData.ice} onChange={handleChange} placeholder="ICE" required />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" required />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required />
            <input type="password" name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} placeholder="Confirmer mot de passe" required />
            <button type="submit">Créer Acheteur</button>
        </form>
    );
};

export default CreateAcheteur;
 
/* 
import React, { useState } from 'react';
import axios from './acheteurConfigs';

const CreateAcheteur = ({ onAcheteurCreated }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        adresse1: '',
        adresse2: '',
        codepostal: '',
        phone: '',
        email: '',
        password: '',
        confirmpassword: '',
        roles: 'ROLE_ACHETEUR_PRE',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/acheteurs', formData);
            onAcheteurCreated(response.data);
        } catch (error) {
            console.error('Erreur lors de la création de l\'acheteur:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="text" name="adresse1" placeholder="Address 1" value={formData.adresse1} onChange={handleChange} />
            <input type="text" name="adresse2" placeholder="Address 2" value={formData.adresse2} onChange={handleChange} />
            <input type="text" name="codepostal" placeholder="Postal Code" value={formData.codepostal} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmpassword" placeholder="Confirm Password" value={formData.confirmpassword} onChange={handleChange} required />
            <button type="submit">Create Acheteur</button>
        </form>
    );
};

export default CreateAcheteur; */
