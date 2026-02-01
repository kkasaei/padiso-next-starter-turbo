export type FavoriteDto = {
  id: string;
  name: string;
  image: string | null;
  record: string;
  type: 'contact' | 'company' | 'project';
  order: number;
};

