const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', async (req, res) => {
	try {
		const fichier1 = await fs.readFile(
			'./20211101_B3D54FD00007B2.csv',
			'utf8'
		);
		const fichier2 = await fs.readFile(
			'./20211101_B3D54FD000088A.csv',
			'utf8'
		);
		const fichier3 = await fs.readFile(
			'./20211101_B3D54FD000088F.csv',
			'utf8'
		);

		function csvToArray(texte) {
			const lignes = texte.split('\n').filter((l) => l.trim());
			const entetes = lignes[0].split(',');
			const donnees = [];
			for (let i = 1; i < lignes.length; i++) {
				const valeurs = lignes[i].split(',');
				const objet = {};

				entetes.forEach((entete, index) => {
					objet[entete.trim()] = valeurs[index]?.trim();
				});

				donnees.push(objet);
			}

			return donnees;
		}

		const data = [
			...csvToArray(fichier1),
			...csvToArray(fichier2),
			...csvToArray(fichier3),
		];

		res.json({ data: data });
	} catch (error) {
		console.error('Erreur:', error);
		res.status(500).json({ error: 'Erreur de lecture des fichiers' });
	}
});

// 4️⃣ Démarrer le serveur
app.listen(3000, () => {
	console.log('Serveur démarré sur http://localhost:3000');
});
