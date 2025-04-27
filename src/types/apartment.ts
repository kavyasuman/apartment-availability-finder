export type Location = 'kadri' | 'bejai';

export type Flat = {
  id: string;
  name: string;
  location: Location;
  capacity: number;
};

export type Availability = {
  date: string;
  day: string;
  flatAvailability: {
    [flatId: string]: {
      available: boolean;
      guestCount: number;
      guestName?: string;
      amount?: number;
    }
  };
};

export type DateAvailability = {
  date: string;
  day: string;
  availableFlats: string[];
};

export type Location = 'kadri' | 'bejai' | 'all';
