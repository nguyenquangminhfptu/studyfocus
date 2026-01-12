import {http} from "./http";


export async function pingBackend(): Promise<string> {
  const res = await http.get<string>("/ping", { responseType: "text" as any });
  return res.data as unknown as string;
}