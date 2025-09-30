type Handler = () => void;

let handlers: Handler[] = [];

export function onUnauthorized(handler: Handler) {
  handlers.push(handler);
  return () => {
    handlers = handlers.filter(h => h !== handler);
  };
}

export function emitUnauthorized() {
  handlers.forEach(h => h());
}


