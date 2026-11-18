import { api } from "@/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type { IndustryDestination } from "@/features/catalog/api/catalog.api";
export type RfqInput = {
  designId?: string;
  industry: string;
  category: string;
  title: string;
  description?: string;
  requestedBrand?: string;
  referenceProduct?: string;
  referenceUrl?: string;
  material: string;
  finishes?: string;
  mosaic?: string;
  dimensions?: string;
  quantity: number;
  countryCode: string;
  city: string;
  preferredTimeframe?: string;
  specifications: Record<string, string>;
};
export type Snapshot = {
  amountMinor: number;
  currency: string;
  currencyExponent: number;
  quantity: number;
  materials: string;
  deliveryDays: number;
  validUntil: string;
  terms: string;
  taxTreatment: string;
  shippingTerms: string;
  manufacturerReference: string;
  responseFileId: string;
  responseHash?: string;
};
export type Rfq = {
  id: string;
  status: string;
  revision: number;
  details: RfqInput;
  designVersionId: string;
  houseId?: string;
  approvals: Record<string, { decision: string }>;
  manufacturerAssigned: boolean;
  acceptedSnapshot: Snapshot | null;
  offers: { id: string; status: string; snapshot: Snapshot; hash: string }[];
  files: {
    id: string;
    kind: string;
    name: string;
    mime: string;
    size: number;
    hash: string;
  }[];
  events: { revision: number; action: string; at: string; reason?: string }[];
  createdAt: string;
  submittedAt: string | null;
  orderAllowed: false;
  productionAuthorized: false;
  commerceHandoff: string;
};
export type RfqSummary = {
  id: string;
  title: string;
  industry: string;
  category: string;
  status: string;
  designVersionId: string;
  createdAt: string;
};
const data = async <T>(p: Promise<{ data: ApiResponse<T> }>) =>
  (await p).data.data;
export const rfqApi = {
  capabilities: () =>
    data(
      api.get<
        ApiResponse<{
          enabled: boolean;
          industries: string[];
          industryDestinations: IndustryDestination[];
          generation: string;
        }>
      >("/rfqs/capabilities"),
    ),
  list: (
    mode: "mine" | "staff" | "manufacturer",
    status: string,
    page: number,
  ) =>
    data(
      api.get<
        ApiResponse<{ items: RfqSummary[]; page: number; hasMore: boolean }>
      >(
        `/rfqs/${mode === "staff" ? "staff/inbox" : mode === "manufacturer" ? "manufacturer/inbox" : "mine"}`,
        { params: { ...(status ? { status } : {}), page } },
      ),
    ),
  get: (id: string) => data(api.get<ApiResponse<Rfq>>(`/rfqs/${id}`)),
  create: (body: RfqInput, key: string) =>
    data(
      api.post<ApiResponse<Rfq>>("/rfqs", body, {
        headers: { "Idempotency-Key": key },
      }),
    ),
  action: (id: string, path: string, body: unknown = {}) =>
    data(api.post<ApiResponse<Rfq>>(`/rfqs/${id}/${path}`, body)),
  upload: (id: string, kind: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    return data(
      api.post<ApiResponse<Rfq>>(`/rfqs/${id}/files/${kind}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },
  download: async (id: string, fileId: string, name: string) => {
    const response = await api.get(`/rfqs/${id}/files/${fileId}`, {
      responseType: "blob",
    });
    saveBlob(response.data, name);
  },
  brief: async (id: string) => {
    const brief = await data(
      api.get<ApiResponse<unknown>>(`/rfqs/${id}/brief`),
    );
    saveBlob(
      new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }),
      `MERGE-RFQ-${id}.json`,
    );
  },
};
function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
