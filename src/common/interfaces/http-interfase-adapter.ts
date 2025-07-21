export interface HttpInterfaceAdapter {
    get<T>(url: string): Promise<T>;
}
