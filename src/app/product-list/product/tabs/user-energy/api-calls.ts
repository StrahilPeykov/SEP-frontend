import { userEnergyEmissionApi, UserEnergyEmission } from "@/lib/api/userEnergyEmissionApi";
import { FormData } from "./types";
import { bomApi, LineItem } from "@/lib/api/bomApi";

// ── Fetch all user energy emissions ─────────────────────────
export const fetchEmissions = async (
  setIsLoading: (a: boolean) => void,
  company_pk: number,
  productId: () => number,
  setEmissions: (a: UserEnergyEmission[]) => void
) => {
  setIsLoading(true);
  try {
    const data = await userEnergyEmissionApi.getAllUserEnergyEmissions(company_pk, productId());
    setEmissions(data);
  } catch (error) {
    console.error("Error fetching emissions:", error);
  } finally {
    setIsLoading(false);
  }
};

// ── Handle submit for add/edit emission ──────────────────────
export const handleSubmit = async (
  formData: FormData,
  setIsSubmitting: (a: boolean) => void,
  currentEmission: UserEnergyEmission | null,
  company_pk: number,
  productId: () => number,
  setIsLoading: (a: boolean) => void,
  setEmissions: (a: UserEnergyEmission[]) => void,
  setIsModalOpen: (a: boolean) => void,
  onFieldChange: () => void
) => {
  const energyConsumption = parseFloat(formData.energy_consumption);
  if (isNaN(energyConsumption) || energyConsumption < 1) {
    alert("Please enter a valid energy consumption value (must be 1 or greater)");
    return;
  }
  if (
    formData.override_factors.some(
      factor =>
        typeof factor.lifecycle_stage !== "string" ||
        factor.lifecycle_stage.trim() === "" ||
        typeof factor.co_2_emission_factor_biogenic !== "number" ||
        isNaN(factor.co_2_emission_factor_biogenic) ||
        typeof factor.co_2_emission_factor_non_biogenic !== "number" ||
        isNaN(factor.co_2_emission_factor_non_biogenic)
    )
  ) {
    alert("Please fill in all override factor fields correctly.");
    return;
  }

  setIsSubmitting(true);
  try {
    const reference = formData.reference ? parseInt(formData.reference) : null;

    const data = {
      energy_consumption: energyConsumption,
      reference,
      override_factors:
        formData.override_factors.length > 0 ? formData.override_factors : undefined,
      line_items: formData.line_items.length > 0 ? formData.line_items : undefined,
    };

    if (currentEmission) {
      // Update existing emission
      await userEnergyEmissionApi.updateUserEnergyEmission(
        company_pk,
        productId(),
        currentEmission.id,
        data
      );
    } else {
      // Create new emission
      await userEnergyEmissionApi.createUserEnergyEmission(company_pk, productId(), data);
    }

    // Refresh the list of emissions
    await fetchEmissions(setIsLoading, company_pk, productId, setEmissions);
    setIsModalOpen(false);
    onFieldChange(); // Notify parent component of changes
  } catch (error) {
    console.error("Error saving emission:", error);
  } finally {
    setIsSubmitting(false);
  }
};

// ── Delete emission ──────────────────────────────────────────
export const handleDelete = async (
  deletingEmissionId: number | null,
  company_pk: number,
  productId: () => number,
  setEmissions: (a: UserEnergyEmission[]) => void,
  emissions: UserEnergyEmission[],
  setIsDeleteModalOpen: (a: boolean) => void,
  setDeletingEmissionId: (a: number | null) => void,
  onFieldChange: () => void
) => {
  if (deletingEmissionId === null) return;

  try {
    await userEnergyEmissionApi.deleteUserEnergyEmission(
      company_pk,
      productId(),
      deletingEmissionId
    );
    setEmissions(emissions.filter(emission => emission.id !== deletingEmissionId));
    setIsDeleteModalOpen(false);
    setDeletingEmissionId(null);
    onFieldChange(); // Notify parent component of changes
  } catch (error) {
    console.error("Error deleting emission:", error);
  }
};

// ── Fetch BOM line items ─────────────────────────────────────
export const fetchBomLineItems = async (
  company_pk: number,
  productId: () => number,
  setBomLineItems: (a: LineItem[]) => void
) => {
  try {
    const data = await bomApi.getAllLineItems(company_pk, productId());
    setBomLineItems(data);
  } catch (error) {
    console.error("Error fetching BOM items:", error);
  }
};
