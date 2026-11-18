import { useRef, useState } from "react";
import MergeMasterLogo from "@/components/MergeMasterLogo";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { coreApi } from "@/experience/core.api";
import { setPreferredLanguage } from "@/i18n";
import { rfqApi, type RfqInput, type Snapshot } from "./rfq.api";
import { rfqCopy, states } from "./rfq.copy";
import "./rfq.css";

const defaults: RfqInput = {
  industry: "FASHION_LUXURY",
  category: "",
  title: "",
  requestedBrand: "",
  referenceProduct: "",
  material: "",
  finishes: "",
  mosaic: "",
  dimensions: "",
  quantity: 1,
  countryCode: "GE",
  city: "",
  specifications: {},
};
const categoryFields: Record<string, [string, string[]][]> = {
  EYEWEAR: [
    ["lensType", ["Lens type", "ლინზის ტიპი", "Тип линз", "نوع العدسة"]],
    [
      "electronics",
      [
        "Electronics required",
        "სასურველი ელექტრონიკა",
        "Электроника",
        "الإلكترونيات المطلوبة",
      ],
    ],
  ],
  WATCH: [
    ["movement", ["Movement", "მექანიზმი", "Механизм", "آلية الساعة"]],
    [
      "strap",
      [
        "Strap and clasp",
        "სამაჯური და საკეტი",
        "Браслет и застёжка",
        "السوار والقفل",
      ],
    ],
  ],
  FASHION: [
    [
      "garment",
      ["Garment type", "ტანსაცმლის ტიპი", "Вид одежды", "نوع الملابس"],
    ],
    [
      "fit",
      [
        "Fit requirements",
        "მორგების მოთხოვნები",
        "Требования к посадке",
        "متطلبات المقاس",
      ],
    ],
  ],
  MOBILITY: [
    [
      "vehicle",
      [
        "Vehicle reference",
        "ავტომობილის რეფერენსი",
        "Модель автомобиля",
        "مرجع المركبة",
      ],
    ],
    [
      "installation",
      [
        "Installation and safety",
        "ინსტალაცია და უსაფრთხოება",
        "Установка и безопасность",
        "التركيب والسلامة",
      ],
    ],
  ],
  JEWELRY: [
    [
      "setting",
      [
        "Setting and stones",
        "ბუდე და ქვები",
        "Оправа и камни",
        "الترصيع والأحجار",
      ],
    ],
  ],
  INTERIOR: [
    [
      "installation",
      [
        "Installation requirements",
        "მონტაჟის მოთხოვნები",
        "Требования к монтажу",
        "متطلبات التركيب",
      ],
    ],
  ],
  ROBOTICS: [
    [
      "function",
      [
        "Required function",
        "სასურველი ფუნქცია",
        "Требуемая функция",
        "الوظيفة المطلوبة",
      ],
    ],
  ],
  GAME: [
    [
      "platform",
      [
        "Platform and interaction",
        "პლატფორმა და მართვა",
        "Платформа и управление",
        "المنصة والتفاعل",
      ],
    ],
  ],
  MUSICAL_INSTRUMENTS: [
    [
      "instrument",
      [
        "Instrument and acoustic needs",
        "ინსტრუმენტი და აკუსტიკა",
        "Инструмент и акустика",
        "الآلة والمتطلبات الصوتية",
      ],
    ],
  ],
  NATURE: [
    [
      "environment",
      [
        "Environment and care",
        "გარემო და მოვლა",
        "Условия и уход",
        "البيئة والعناية",
      ],
    ],
  ],
  ART: [["technique", ["Technique", "ტექნიკა", "Техника", "التقنية"]]],
  MOSAIC: [
    [
      "surface",
      [
        "Surface and mosaic scale",
        "ზედაპირი და მოზაიკის მასშტაბი",
        "Поверхность и масштаб мозаики",
        "السطح ومقياس الفسيفساء",
      ],
    ],
  ],
};
const specificationFields: Record<string, [string, string[]][]> = {
  FASHION_LUXURY: [...categoryFields.EYEWEAR, ...categoryFields.WATCH, ...categoryFields.FASHION, ...categoryFields.JEWELRY],
  MOBILITY_ENGINEERING: categoryFields.MOBILITY,
  HOME_FAMILY: categoryFields.INTERIOR,
  ARCHITECTURE_CONSTRUCTION_DECOR: categoryFields.INTERIOR,
  KIDS_TOYS_GAMES: categoryFields.GAME,
  MUSIC_SOUND: categoryFields.MUSICAL_INSTRUMENTS,
  TECHNOLOGY_FUTURE: categoryFields.ROBOTICS,
  ART_MOSAIC_CULTURE: [...categoryFields.ART, ...categoryFields.MOSAIC],
  SPORTS_OUTDOOR: categoryFields.NATURE,
  SACRED_ART_HERITAGE: categoryFields.ART,
};
const price = (offer: Snapshot) => {
  const n = String(offer.amountMinor).padStart(offer.currencyExponent + 1, "0");
  return `${offer.currency} ${offer.currencyExponent ? `${n.slice(0, -offer.currencyExponent)}.${n.slice(-offer.currencyExponent)}` : n}`;
};

export default function RfqPage({
  mode = "mine",
  create = false,
}: {
  mode?: "mine" | "staff" | "manufacturer";
  create?: boolean;
}) {
  const { i18n } = useTranslation();
  const { text: t, code, dir } = rfqCopy(i18n.language);
  const [params, setParams] = useSearchParams();
  const id = params.get("id");
  const designId = params.get("designId");
  const user = useAuthStore((s) => s.user);
  const cache = useQueryClient();
  const [page, setPage] = useState(0),
    [status, setStatus] = useState("");
  const [form, setForm] = useState<RfqInput>({
    ...defaults,
    industry: params.get("industry") || defaults.industry,
  });
  const [consent, setConsent] = useState(false),
    [rights, setRights] = useState(false);
  const [file, setFile] = useState<File | null>(null),
    [kind, setKind] = useState(mode === "mine" ? "REFERENCE" : "EVIDENCE");
  const [fileInputRevision, setFileInputRevision] = useState(0);
  const [reason, setReason] = useState(""),
    [action, setAction] = useState("START_REVIEW");
  const [evidence, setEvidence] = useState(""),
    [manufacturerId, setManufacturerId] = useState("");
  const [scope, setScope] = useState("BRAND"),
    [decision, setDecision] = useState("APPROVED"),
    [offerId, setOfferId] = useState("");
  const pendingKey = useRef<{ body: string; key: string } | null>(null);
  const capabilities = useQuery({
    queryKey: ["rfq-capabilities", user?.id],
    queryFn: rfqApi.capabilities,
    retry: false,
  });
  const list = useQuery({
    queryKey: ["rfqs", user?.id, mode, status, page],
    queryFn: () => rfqApi.list(mode, status, page),
    enabled: !create,
    retry: false,
  });
  const query = useQuery({
    queryKey: ["rfq", user?.id, id],
    queryFn: () => rfqApi.get(id!),
    enabled: !!id,
    retry: false,
  });
  const designs = useQuery({
    queryKey: ["rfq-source-designs", user?.id],
    queryFn: coreApi.designs,
    enabled: !!designId && !id,
    retry: false,
  });
  const source = designs.data?.find((d) => d.id === designId);
  const importSource = () => {
    if (source)
      setForm((current) => ({
        ...current,
        title: current.title || (source.preferences.notes || "").slice(0, 160),
        description: current.description || source.preferences.notes || "",
        material: current.material || source.preferences.material || "",
      }));
  };
  const update = (patch: Partial<RfqInput>) =>
    setForm((current) => ({ ...current, ...patch }));
  const done = () => {
    cache.invalidateQueries({ queryKey: ["rfq"] });
    cache.invalidateQueries({ queryKey: ["rfqs"] });
    cache.invalidateQueries({ queryKey: ["personal-museum"] });
    cache.invalidateQueries({ queryKey: ["core-designs"] });
  };
  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        ...(designId ? { designId } : {}),
        ...(form.referenceUrl ? {} : { referenceUrl: undefined }),
      };
      const body = JSON.stringify(payload);
      if (!pendingKey.current || pendingKey.current.body !== body)
        pendingKey.current = { body, key: crypto.randomUUID() };
      return rfqApi.create(payload, pendingKey.current.key);
    },
    onSuccess: (value) => {
      setParams({ id: value.id });
      done();
    },
  });
  const change = useMutation({
    mutationFn: ({ path, body }: { path: string; body?: unknown }) =>
      rfqApi.action(id!, path, body),
    onSuccess: done,
  });
  const upload = useMutation({
    mutationFn: () => rfqApi.upload(id!, kind, file!),
    onSuccess: () => {
      setFile(null);
      setFileInputRevision((n) => n + 1);
      done();
    },
  });
  const download = useMutation({
    mutationFn: ({ fileId, name }: { fileId: string; name: string }) =>
      rfqApi.download(id!, fileId, name),
  });
  const brief = useMutation({ mutationFn: () => rfqApi.brief(id!) });
  const row = query.data,
    enabled = capabilities.data?.enabled === true;
  const busy = save.isPending || change.isPending || upload.isPending;
  const chosenOffer = row?.offers.some((o) => o.id === offerId)
    ? offerId
    : row?.offers[0]?.id || "";
  const evidenceFiles = row?.files.filter((f) => f.kind === "EVIDENCE") ?? [];
  const chosenEvidence = evidenceFiles.some((f) => f.id === evidence)
    ? evidence
    : evidenceFiles[0]?.id || "";
  const input = (
    key: keyof RfqInput,
    label: string,
    required = false,
    textarea = false,
  ) => (
    <label>
      {label}
      {textarea ? (
        <textarea
          value={String(form[key] ?? "")}
          required={required}
          maxLength={
            key === "description" ? 2000 : key === "material" ? 1000 : 500
          }
          onChange={(e) => update({ [key]: e.target.value })}
        />
      ) : (
        <input
          value={String(form[key] ?? "")}
          required={required}
          maxLength={
            key === "title"
              ? 160
              : key === "referenceUrl"
                ? 1000
                : key === "referenceProduct"
                  ? 160
                  : 100
          }
          type={key === "referenceUrl" ? "url" : "text"}
          pattern={
            key === "countryCode"
              ? "[A-Z]{2}"
              : key === "referenceUrl"
                ? "https://.*"
                : undefined
          }
          dir={
            ["referenceUrl", "countryCode"].includes(key) ? "ltr" : undefined
          }
          onChange={(e) => update({ [key]: e.target.value })}
        />
      )}
    </label>
  );

  return (
    <main className="rfq-page" dir={dir} lang={code}>
      <header className="rfq-header">
        <Link to="/museum">
          <MergeMasterLogo className="rfq-master-logo" decorative />
          MERGE STARS
        </Link>
        <nav>
          <Link to="/rfq/new">{t("new")}</Link>
          <Link to="/my-requests">{t("mine")}</Link>
          <Link to="/my-museum">{t("museum")}</Link>
        </nav>
        <label className="rfq-language">
          <span>Language</span>
          <select
            value={code}
            onChange={(e) => setPreferredLanguage(e.target.value)}
          >
            {[
              ["ka", "ქართული"],
              ["en", "English"],
              ["ru", "Русский"],
              ["ar", "العربية"],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </header>
      <section className="rfq-intro">
        <span>MERGE / UNIVERSAL RFQ</span>
        <h1>
          {mode === "staff"
            ? t("staff")
            : mode === "manufacturer"
              ? t("manufacturer")
              : t("title")}
        </h1>
        <p>{t("subtitle")}</p>
      </section>
      {capabilities.isLoading && <p role="status">{t("loading")}</p>}
      {!capabilities.isLoading && !enabled && (
        <p className="rfq-notice" role="status">
          {t("unavailable")}
        </p>
      )}
      {(save.isError ||
        change.isError ||
        upload.isError ||
        download.isError ||
        brief.isError ||
        query.isError ||
        list.isError) && (
        <p role="alert" className="rfq-error">
          {t("failed")}
        </p>
      )}
      {create && !id && (
        <form
          className="rfq-form"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <h2>{t("private")}</h2>
          <p>{t("participation")}</p>
          <p>{t("generation")}</p>
          {designId && (
            <p>
              Design version: <bdi dir="ltr">{designId}</bdi>
            </p>
          )}
          {source && (
            <button type="button" onClick={importSource}>
              {t("importSource")}
            </button>
          )}
          <div className="rfq-grid">
            <label>
              {t("industry")}
              <select
                value={form.industry}
                onChange={(e) =>
                  update({ industry: e.target.value, specifications: {} })
                }
              >
                {capabilities.data?.industryDestinations.map((industry) => (
                  <option key={industry.code} value={industry.code}>
                    {code === "ka" ? industry.labelKa : industry.label}
                  </option>
                ))}
              </select>
            </label>
            {input("category", t("category"), true)}
            {input("title", t("name"), true)}
            {input("requestedBrand", t("brand"))}
            {input("referenceProduct", t("model"))}
            {input("referenceUrl", t("reference"))}
          </div>
          <div className="rfq-grid">
            {input("material", t("material"), true, true)}
            {input("description", t("designBrief"), false, true)}
            {input("finishes", t("finishes"), false, true)}
            {input("mosaic", t("mosaic"), false, true)}
            {input("dimensions", t("dimensions"), false, true)}
          </div>
          <fieldset>
            <legend>{t("categoryDetails")}</legend>
            <div className="rfq-grid">
              {(specificationFields[form.industry] ?? []).map(
                ([key, labels]) => (
                  <label key={key}>
                    {
                      labels[
                        code === "ka"
                          ? 1
                          : code === "ru"
                            ? 2
                            : code === "ar"
                              ? 3
                              : 0
                      ]
                    }
                    <input
                      maxLength={500}
                      value={form.specifications[key] ?? ""}
                      onChange={(e) =>
                        update({
                          specifications: {
                            ...form.specifications,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ),
              )}
            </div>
          </fieldset>
          <div className="rfq-grid">
            <label>
              {t("quantity")}
              <input
                required
                type="number"
                min={1}
                max={10000}
                step={1}
                value={form.quantity}
                dir="ltr"
                onChange={(e) => update({ quantity: Number(e.target.value) })}
              />
            </label>
            {input("countryCode", t("country"), true)}
            {input("city", t("city"), true)}
            {input("preferredTimeframe", t("timeframe"))}
          </div>
          <button disabled={!enabled || busy} className="rfq-primary">
            {save.isPending ? t("loading") : t("save")}
          </button>
        </form>
      )}
      {!create && (
        <section className="rfq-list">
          <label>
            {t("status")}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              {["", ...states].map((value) => (
                <option key={value} value={value}>
                  {value || t("all")}
                </option>
              ))}
            </select>
          </label>
          {list.isLoading && <p role="status">{t("loading")}</p>}
          <div className="rfq-grid">
            {list.data?.items.map((item) => (
              <button
                className="rfq-list-card"
                key={item.id}
                onClick={() => setParams({ id: item.id })}
              >
                <span>
                  <bdi dir="ltr">{item.status}</bdi>
                </span>
                <strong>{item.title}</strong>
                <small>
                  <bdi dir="ltr">{item.id}</bdi>
                </small>
                <span>{t("select")} →</span>
              </button>
            ))}
          </div>
          <div className="rfq-actions">
            <button disabled={page === 0} onClick={() => setPage((n) => n - 1)}>
              {t("previous")}
            </button>
            <bdi dir="ltr">{page + 1}</bdi>
            <button
              disabled={!list.data?.hasMore}
              onClick={() => setPage((n) => n + 1)}
            >
              {t("next")}
            </button>
          </div>
        </section>
      )}
      {query.isLoading && id && <p role="status">{t("loading")}</p>}
      {row && (
        <section className="rfq-detail" key={row.id}>
          <span className="rfq-pill">
            <bdi dir="ltr">{row.status}</bdi>
          </span>
          <h2>{row.details.title}</h2>
          <dl>
            <div>
              <dt>RFQ ID</dt>
              <dd>
                <bdi dir="ltr">{row.id}</bdi>
              </dd>
            </div>
            <div>
              <dt>Design version</dt>
              <dd>
                <bdi dir="ltr">{row.designVersionId}</bdi>
              </dd>
            </div>
            <div>
              <dt>{t("brand")}</dt>
              <dd>
                {row.details.requestedBrand || "—"} ·{" "}
                {row.details.referenceProduct}
              </dd>
            </div>
            <div>
              <dt>{t("quantity")}</dt>
              <dd>
                <bdi dir="ltr">{row.details.quantity}</bdi>
              </dd>
            </div>
          </dl>
          <p>
            {row.details.material} · {row.details.mosaic} ·{" "}
            {row.details.dimensions}
          </p>
          <p>
            {row.details.countryCode} · {row.details.city}
          </p>
          <p>{row.details.description}</p>
          <dl>
            <div>
              <dt>{t("industry")}</dt>
              <dd>
                <bdi>{capabilities.data?.industryDestinations.find(industry => industry.code === row.details.industry)?.[code === "ka" ? "labelKa" : "label"] ?? row.details.industry}</bdi> ·{" "}
                {row.details.category}
              </dd>
            </div>
            <div>
              <dt>{t("finishes")}</dt>
              <dd>{row.details.finishes || "—"}</dd>
            </div>
            <div>
              <dt>{t("timeframe")}</dt>
              <dd>{row.details.preferredTimeframe || "—"}</dd>
            </div>
            {row.details.referenceUrl && (
              <div>
                <dt>{t("reference")}</dt>
                <dd>
                  <bdi dir="ltr">{row.details.referenceUrl}</bdi>
                </dd>
              </div>
            )}
            {Object.entries(row.details.specifications).map(([key, value]) => {
              const labels = specificationFields[row.details.industry]?.find(
                ([name]) => name === key,
              )?.[1];
              return (
                <div key={key}>
                  <dt>
                    {labels?.[
                      code === "ka"
                        ? 1
                        : code === "ru"
                          ? 2
                          : code === "ar"
                            ? 3
                            : 0
                    ] || key}
                  </dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
          <p>{t("participation")}</p>
          <h3>{t("files")}</h3>
          <p>{t("fileHint")}</p>
          <ul className="rfq-files">
            {row.files.map((f) => (
              <li key={f.id}>
                <span>
                  {f.name}{" "}
                  <small>
                    <bdi dir="ltr">
                      {f.kind} · {f.id}
                    </bdi>
                  </small>
                </span>
                <button
                  disabled={download.isPending}
                  onClick={() =>
                    download.mutate({ fileId: f.id, name: f.name })
                  }
                >
                  {t("download")}
                </button>
              </li>
            ))}
          </ul>
          {(row.status === "DRAFT" || mode !== "mine") &&
            !["ACCEPTED", "CANCELLED", "REJECTED"].includes(row.status) && (
              <form
                className="rfq-upload"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (file) upload.mutate();
                }}
              >
                <label>
                  {t("files")}
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                  >
                    {(mode === "mine"
                      ? [
                          ["REFERENCE", t("referenceFile")],
                          ["MODEL", t("modelFile")],
                        ]
                      : [["EVIDENCE", t("evidence")]]
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    key={fileInputRevision}
                    type="file"
                    required
                    accept={
                      kind === "EVIDENCE"
                        ? ".pdf,.png,.jpg,.jpeg,.webp"
                        : kind === "MODEL"
                          ? ".glb,.stl"
                          : ".png,.jpg,.jpeg,.webp"
                    }
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <button disabled={!enabled || busy || !file}>
                  {t("upload")}
                </button>
              </form>
            )}
          {mode === "mine" && row.status === "DRAFT" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                change.mutate({
                  path: "submit",
                  body: { rightsDeclaration: rights, sharingConsent: consent },
                });
              }}
            >
              <label className="rfq-check">
                <input
                  type="checkbox"
                  required
                  checked={rights}
                  onChange={(e) => setRights(e.target.checked)}
                />
                {t("rights")}
              </label>
              <label className="rfq-check">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                {t("consent")}
              </label>
              <button
                className="rfq-primary"
                disabled={!enabled || busy || !rights || !consent}
              >
                {t("submit")}
              </button>
            </form>
          )}
          <h3>{t("approvals")}</h3>
          <div className="rfq-approvals">
            {[
              ["BRAND", "confirmedBrand"],
              ["TECHNICAL", "technical"],
              ["COMMERCIAL", "commercial"],
            ].map(([value, label]) => (
              <div key={value}>
                <span>{t(label as "confirmedBrand")}</span>
                <bdi dir="ltr">
                  {row.approvals[value]?.decision || "PENDING"}
                </bdi>
              </div>
            ))}
          </div>
          <h3>{t("offers")}</h3>
          {!row.offers.length && <p>{t("noOffers")}</p>}
          {row.offers.map((offer) => (
            <article className="rfq-offer" key={offer.id}>
              <bdi dir="ltr">
                {offer.id} · {offer.status}
              </bdi>
              <strong>
                <bdi dir="ltr">{price(offer.snapshot)}</bdi>
              </strong>
              <p>{offer.snapshot.materials}</p>
              <p>
                {t("deliveryDays")}:{" "}
                <bdi dir="ltr">{offer.snapshot.deliveryDays}</bdi>
              </p>
              <p>
                {t("quoteReference")}:{" "}
                <bdi dir="ltr">{offer.snapshot.manufacturerReference}</bdi>
              </p>
              <p>{offer.snapshot.terms}</p>
              <p>
                {t("tax")}: {offer.snapshot.taxTreatment}
              </p>
              <p>
                {t("shipping")}: {offer.snapshot.shippingTerms}
              </p>
              <p>
                {t("validity")}:{" "}
                <bdi dir="ltr">{offer.snapshot.validUntil}</bdi>
              </p>
              {mode === "mine" &&
                row.status === "VERIFIED_OFFER" &&
                offer.status === "VERIFIED" && (
                  <button
                    className="rfq-primary"
                    disabled={!enabled || busy}
                    onClick={() =>
                      change.mutate({ path: `offers/${offer.id}/accept` })
                    }
                  >
                    {t("accept")}
                  </button>
                )}
            </article>
          ))}
          {row.acceptedSnapshot && (
            <section className="rfq-notice">
              <h3>{t("accepted")}</h3>
              <strong>
                <bdi dir="ltr">{price(row.acceptedSnapshot)}</bdi>
              </strong>
            </section>
          )}
          <p className="rfq-notice">{t("paymentGate")}</p>
          {mode === "staff" && (
            <section className="rfq-staff">
              <h3>{t("staff")}</h3>
              <p>{t("contactNotice")}</p>
              <button
                disabled={
                  brief.isPending ||
                  !row.submittedAt ||
                  ["CANCELLED", "REJECTED"].includes(row.status)
                }
                onClick={() => brief.mutate()}
              >
                {t("brief")}
              </button>
              <label>
                {t("reason")}
                <textarea
                  maxLength={1000}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
              <label>
                {t("evidenceId")}
                <select
                  value={chosenEvidence}
                  onChange={(e) => setEvidence(e.target.value)}
                >
                  <option value="">—</option>
                  {evidenceFiles.map((f) => (
                    <option value={f.id} key={f.id}>
                      {f.name} · {f.id}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rfq-actions">
                <select
                  aria-label={t("action")}
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  {[
                    ["START_REVIEW", "startReview"],
                    ["CONTACT_RECORDED", "contact"],
                    ["AWAIT_APPROVAL", "awaitApproval"],
                    ["REJECT", "reject"],
                  ].map(([value, label]) => (
                    <option value={value} key={value}>
                      {t(label as "action")}
                    </option>
                  ))}
                </select>
                <button
                  disabled={!enabled || busy || !reason.trim()}
                  onClick={() =>
                    change.mutate({
                      path: "staff-action",
                      body: {
                        action,
                        reason,
                        ...(chosenEvidence
                          ? { evidenceFileId: chosenEvidence }
                          : {}),
                      },
                    })
                  }
                >
                  {t("action")}
                </button>
              </div>
              <label>
                {t("manufacturerId")}
                <input
                  value={manufacturerId}
                  onChange={(e) => setManufacturerId(e.target.value)}
                  dir="ltr"
                />
              </label>
              <button
                disabled={
                  !enabled || busy || !manufacturerId || !chosenEvidence
                }
                onClick={() =>
                  change.mutate({
                    path: "manufacturer",
                    body: {
                      userId: manufacturerId,
                      evidenceFileId: chosenEvidence,
                    },
                  })
                }
              >
                {t("assign")}
              </button>
              <label>
                {t("offers")}
                <select
                  value={chosenOffer}
                  onChange={(e) => setOfferId(e.target.value)}
                >
                  <option value="">—</option>
                  {row.offers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rfq-actions">
                <select
                  aria-label={t("approveKind")}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  {["BRAND", "TECHNICAL", "COMMERCIAL"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <select
                  aria-label={t("decision")}
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  {["APPROVED", "REJECTED", "NOT_REQUIRED"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <button
                  disabled={
                    !enabled ||
                    busy ||
                    !reason.trim() ||
                    (decision !== "NOT_REQUIRED" && !chosenEvidence)
                  }
                  onClick={() =>
                    change.mutate({
                      path: "approvals",
                      body: {
                        kind: scope,
                        decision,
                        reason,
                        ...(chosenEvidence
                          ? { evidenceFileId: chosenEvidence }
                          : {}),
                        ...(scope === "COMMERCIAL" && chosenOffer
                          ? { offerId: chosenOffer }
                          : {}),
                      },
                    })
                  }
                >
                  {t("approve")}
                </button>
              </div>
              <button
                disabled={!enabled || busy || !chosenOffer}
                onClick={() =>
                  change.mutate({ path: `offers/${chosenOffer}/verify` })
                }
              >
                {t("verify")}
              </button>
            </section>
          )}
          {mode === "manufacturer" &&
            [
              "UNDER_REVIEW",
              "BRAND_CONTACTED",
              "APPROVAL_PENDING",
              "OFFER_RECEIVED",
            ].includes(row.status) && (
              <ManufacturerProposal
                disabled={!enabled || busy}
                files={evidenceFiles}
                submit={(body) => change.mutate({ path: "offers", body })}
                language={i18n.language}
                quantity={row.details.quantity}
              />
            )}
          {mode === "mine" &&
            !["CANCELLED", "REJECTED"].includes(row.status) && (
              <div className="rfq-cancel">
                <label>
                  {t("reason")}
                  <input
                    maxLength={1000}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <button
                  disabled={!enabled || busy || !reason.trim()}
                  onClick={() =>
                    change.mutate({ path: "cancel", body: { reason } })
                  }
                >
                  {t("cancel")}
                </button>
              </div>
            )}
          <details>
            <summary>{t("history")}</summary>
            <ol>
              {row.events.map((event) => (
                <li key={event.revision}>
                  <bdi dir="ltr">
                    {event.revision} · {event.action} · {event.at}
                  </bdi>
                  {event.reason && <p>{event.reason}</p>}
                </li>
              ))}
            </ol>
          </details>
        </section>
      )}
    </main>
  );
}

function ManufacturerProposal({
  disabled,
  files,
  submit,
  language,
  quantity,
}: {
  disabled: boolean;
  files: { id: string; name: string }[];
  submit: (body: Snapshot) => void;
  language: string;
  quantity: number;
}) {
  const { text: t } = rfqCopy(language);
  const [values, setValues] = useState<Record<string, string>>({
    currency: "USD",
    currencyExponent: "2",
  });
  const field = (key: string, label: string, type = "text") => (
    <label>
      {label}
      <input
        required
        type={type}
        maxLength={key === "terms" ? 2000 : 1000}
        min={
          type === "number" ? (key === "currencyExponent" ? 0 : 1) : undefined
        }
        max={key === "currencyExponent" ? 3 : undefined}
        value={values[key] ?? ""}
        dir={
          [
            "amountMinor",
            "currency",
            "currencyExponent",
            "validUntil",
          ].includes(key)
            ? "ltr"
            : undefined
        }
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
    </label>
  );
  return (
    <form
      className="rfq-manufacturer"
      onSubmit={(e) => {
        e.preventDefault();
        submit({
          amountMinor: Number(values.amountMinor),
          currency: values.currency,
          currencyExponent: Number(values.currencyExponent),
          quantity,
          materials: values.materials,
          deliveryDays: Number(values.deliveryDays),
          validUntil: new Date(values.validUntil).toISOString(),
          terms: values.terms,
          taxTreatment: values.taxTreatment,
          shippingTerms: values.shippingTerms,
          manufacturerReference: values.manufacturerReference,
          responseFileId: values.responseFileId,
        });
      }}
    >
      <h3>{t("proposal")}</h3>
      <div className="rfq-grid">
        {field("amountMinor", t("amountMinor"), "number")}
        {field("currency", t("currency"))}
        {field("currencyExponent", t("exponent"), "number")}
        {field("materials", t("material"))}
        {field("deliveryDays", t("deliveryDays"), "number")}
        {field("validUntil", t("validity"), "datetime-local")}
        {field("terms", t("terms"))}
        {field("taxTreatment", t("tax"))}
        {field("shippingTerms", t("shipping"))}
        {field("manufacturerReference", t("quoteReference"))}
        <label>
          {t("responseFile")}
          <select
            required
            value={values.responseFileId ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, responseFileId: e.target.value }))
            }
          >
            <option value="">—</option>
            {files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name} · {file.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button disabled={disabled}>{t("proposal")}</button>
    </form>
  );
}
