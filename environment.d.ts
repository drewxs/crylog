declare global {
  namespace NodeJS {
    interface Process {
      env: {
        [key: string]: string;
      };
      exit: (type: number) => void;
    }
  }
}

export {};
