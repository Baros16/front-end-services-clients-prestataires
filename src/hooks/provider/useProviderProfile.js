// src/hooks/provider/useProviderProfile.js
import { useEffect, useState, useCallback } from "react";
import { getProviderProfile, updateProfile } from "../../services/providerService.js";
import { uploadPhotos, uploadDocument } from "../../services/uploadService.js";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  tags: [],
  hourlyRate: "",
  serviceZoneCity: "",
  serviceZoneRadiusKm: "",
};

export function useProviderProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await getProviderProfile();
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        email: profile.email ?? "",
        // UI simplifiée : un seul tag actif = specialty envoyé à l'API.
        tags: profile.specialty ? [profile.specialty] : [],
        hourlyRate: profile.hourlyRate ?? "",
        serviceZoneCity: profile.serviceZone?.city ?? "",
        serviceZoneRadiusKm: profile.serviceZone?.radiusKm ?? "",
      });
      setAvatarUrl(profile.avatarUrl ?? null);
      setDocuments(profile.documents ?? []);
      setCertifications(profile.certifications ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addTag = useCallback((tag) => {
    if (!tag?.trim()) return;
    setForm((prev) => ({ ...prev, tags: [tag.trim()] }));
  }, []);

  const removeTag = useCallback((tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

  const handlePhotoChange = useCallback(async (file) => {
    if (!file) return;
    const result = await uploadPhotos([file], "profile");
    setAvatarUrl(result.uploads[0].url);
  }, []);

  const handleDocumentUpload = useCallback(async (docType, file) => {
  if (!file) return;
  const result = await uploadDocument(file, docType);
  setDocuments((prev) =>
    prev.map((d) =>
      d.type === docType
        ? { ...d, id: result.uploads[0].id, status: "fourni" }
        : d
    )
  );
}, []);

const handleDocumentRemove = useCallback((docType) => {
  setDocuments((prev) =>
    prev.map((d) =>
      d.type === docType
        ? { ...d, id: null, status: "manquant", fileUrl: null }
        : d
    )
  );
}, []);

  const save = useCallback(async () => {
  setIsSaving(true);
  setError(null);
  try {
    const documentIds = documents.map((d) => d.id).filter(Boolean);
    await updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      specialty: form.tags[0] ?? "",
      hourlyRate: Number(form.hourlyRate) || 0,
      serviceZoneCity: form.serviceZoneCity,
      radiusKm: Number(form.serviceZoneRadiusKm) || 0,
      certifications,
      documentIds,
    });
    return true;
  } catch (err) {
    setError(err);
    return false;
  } finally {
    setIsSaving(false);
  }
}, [form, documents, certifications]);
  return {
    isLoading, isSaving, form, setField, addTag, removeTag,
    avatarUrl, handlePhotoChange, documents, handleDocumentUpload,
    handleDocumentRemove, error, save,
  };
}