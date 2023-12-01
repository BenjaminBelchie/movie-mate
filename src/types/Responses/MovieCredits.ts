import { type Actor } from "../Actor";
import { type Crew } from "../Crew";

export type MovieCreditsResponse = {
  data: {
    id: number;
    cast: Actor[];
    crew: Crew[];
  };
};
