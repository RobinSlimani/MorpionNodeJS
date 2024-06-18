Voici mon petit jeu de Morpion pour tester NodeJS (express et ejs).

J’ai fais en sorte que mon projet créer un container docker simplement en faisant la commande npm run db:start voir ici dans le fichier package.json

ensuite pour le moment j’ai pas fais en sorte de gérer la création de la base de données lors de la première utilisation mais par contre celle-ci est conservée dans le projet si on vient à supprimer le container.

J’ai donc fait un .gitignore qui enlève le dossier .docker qui contient la base de données. 
docker exec -it morpionBD psql -U postgres
CREATE DATABASE morpion;
\c morpion

enfin il suffit juste de faire un docker run start et normalement l’application fonctionne.

Même s'il se trouve que dans la version acctuelle l'application est devenu seulement une application qui peut répondre à des get / put / post parce que je n'avais pas bien compris le tp 8, pour cela il faut revenir à une ancienne version de mon dépot git où je n'avais fais que le jeu et non pas la partie API, pour cela il faut revenir au commit 18acdae7ec14b78f1769a50b5ca90725127d19a6.

Pour la partie React il faut se rendre dans ./morpionReact
ensuite on lance deux terminaux un pour lancer server.js dans src avec node server.js et l'autre pour faire npm start (ce qui lance l'application). 

Pour cette partie il faut faire les étapes suivante car je n'ais pas fais un docker donc il faut le faire directement sur son ordinateur, en effet il aurait été plus pratique de le faire avec un conteneur mais j'ai un manque de temps, sachant les différents projets que l'ont doit faire et l'opération que j'aurais au début des vacances qui m'empêchera de travailler.

Pour que cela fonctionne bien j’ai fais cette config de nginx : 

dans un premier temps j’ai installé nginx
apt install nginx

ensuite j’ai ajouté une nouvelle configuration pour le morpion
sudo vim /etc/nginx/sites-available/morpion

server {
	listen 80;
	server_name localhost;

	location / {
    	proxy_pass http://localhost:3000;
	}

	location /api {
    	proxy_pass http://localhost:3001/api;
	}
}

j’ai fais un lien symbolique : sudo ln -s /etc/nginx/sites-available/morpion /etc/nginx/sites-enabled/

enfin j’ai modifié mon fichier App.js pour changer tous les fetch où il y avait fetch('http://localhost:3001/api/game', {

simplement par fetch('/api/game', {

et j’ai tout relancé
systemctl restart nginx
npm start
node server.js

Robin SLIMANI
