export type Json = {
  [key: string]: Json | string | (string|Json)[];
} | null;

export type StringMap = {
  [key: string]: string;
}

