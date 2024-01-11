// Modified DB
type clientShape = {
  sid: string;
  csrfToken: string;
}

type databaseShape = {
  sid: string;
  data: string;
  timestamp: number;
};

const database: databaseShape = { sid: "", data: "hello", timestamp: Date.now() }
const clients: clientShape[] = [];
export { database, databaseShape, clients, clientShape };