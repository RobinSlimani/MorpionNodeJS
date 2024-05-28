Voici mon petit jeu de Morpion pour tester NodeJS (express et ejs).

J’ai fais en sorte que mon projet créer un container docker simplement en faisant la commande npm run db:start voir ici dans le fichier package.json

ensuite pour le moment j’ai pas fais en sorte de gérer la création de la base de données lors de la première utilisation mais par contre celle-ci est conservée dans le projet si on vient à supprimer le container.

J’ai donc fait un .gitignore qui enlève le dossier .docker qui contient la base de données. 
docker exec -it morpionBD psql -U postgres
CREATE DATABASE morpion;
\c morpion

enfin il suffit juste de faire un docker run start et normalement l’application fonctionne.


Robin SLIMANI
