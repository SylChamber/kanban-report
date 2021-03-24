# Tools

Some development tools

## MongoDB

A `docker-compose` file launches an instance of MongoDB in a container. Run this command in the root of the project:

    docker-compose -f mongostack.yml -d up

The [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) extension serves as a GUI for Mongo and provides a playground to access it using JavaScript. These Playground files provide a way to insert and read data:

* `add-data.mongodb`
* `read-data.mongodb`
