import { Container, CosmosClient } from "@azure/cosmos";

function getContainer(database: string, container: string): Container {
    
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    return new CosmosClient({ endpoint: endpoint, key: key }).database(database)
        .container(container);
}

export { getContainer  }