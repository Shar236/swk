export interface SupabaseBuilder {
  select(fields?: string): SupabaseBuilder;
  eq(field: string, value: any): SupabaseBuilder;
  ilike(field: string, value: any): SupabaseBuilder;
  gte(field: string, value: any): SupabaseBuilder;
  lte(field: string, value: any): SupabaseBuilder;
  in(field: string, values: any[]): SupabaseBuilder;
  or(query: string): SupabaseBuilder;
  single(): SupabaseBuilder;
  maybeSingle(): SupabaseBuilder;
  order(field: string, opts?: any): SupabaseBuilder;
  limit(n: number): SupabaseBuilder;
  update(payload: any): SupabaseBuilder;
  insert(payload: any): SupabaseBuilder;
  upsert(payload: any): SupabaseBuilder;
  delete(): SupabaseBuilder;
  url: string;
  headers: any;
  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>;
}

export const supabase: {
  from: (table: string) => SupabaseBuilder;
  auth: {
    getSession: () => Promise<{ data: { session: any }; error: any }>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
    signOut: () => Promise<{ error: any }>;
    signInWithPassword: (credentials: any) => Promise<{ data: any; error: any }>;
    signUp: (credentials: any) => Promise<{ data: any; error: any }>;
    getUser: () => Promise<{ data: { user: any }; error: any }>;
  };
  storage: {
    from: (bucket: string) => {
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
      upload: (path: string, file: any) => Promise<{ data: any; error: any }>;
    };
  };
};
