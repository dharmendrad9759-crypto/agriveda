import { redirect } from "next/navigation";

/** Old Agriveda2 hub → single farmer entry for crop problems */
export default function CropProblemRedirect() {
  redirect("/crop-problems");
}
