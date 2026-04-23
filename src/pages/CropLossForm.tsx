import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitCropLossCase } from '@/services/firebaseService';

interface CropLossFormValues {
    farmerName: string;
    mobile: string;
    state: string;
    district: string;
    village: string;
    farmArea: string;
    insuranceStatus: string;
    cropName: string;
    season: string;
    sowingDate: string;
    harvestDate: string;
    affectedArea: string;
    causeOfLoss: string;
    damagePercentage: string;
    damageDate: string;
    advisoryCompliance: {
        fertilizer: boolean;
        irrigation: boolean;
        pestControl: boolean;
    };
    declaration: boolean;
    evidence: FileList | null;
}

const CropLossForm = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CropLossFormValues>({
        defaultValues: {
            farmerName: user?.name || '',
            mobile: (user as any)?.mobile || '',
            state: '',
            district: '',
            village: '',
            farmArea: '',
            insuranceStatus: 'No',
            cropName: '',
            season: 'Kharif',
            sowingDate: '',
            harvestDate: '',
            affectedArea: '',
            causeOfLoss: '',
            damagePercentage: '',
            damageDate: '',
            advisoryCompliance: {
                fertilizer: false,
                irrigation: false,
                pestControl: false
            },
            declaration: false,
            evidence: null
        }
    });

    const onSubmit = async (data: CropLossFormValues) => {
        if (!data.declaration) {
            toast.error(t('cropLoss.agreeError'));
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...data,
                location: `${data.village}, ${data.district}, ${data.state}`,
                uid: user?.id || user?.email,
                farmerEmail: user?.email,
            };

            await submitCropLossCase(payload);

            toast.success(t('cropLoss.success'));
            navigate('/');
        } catch (error) {
            console.error("Submission error", error);
            toast.error(t('cropLoss.error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary mb-2">{t('cropLoss.title')}</h1>
                <p className="text-muted-foreground">{t('cropLoss.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Section 1: Farmer Identity */}
                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            {t('cropLoss.sections.farmer')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.name')}</Label>
                            <Input {...register('farmerName', { required: true })} placeholder={t('cropLoss.placeholders.name')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.mobile')}</Label>
                            <Input {...register('mobile', { required: true })} placeholder={t('cropLoss.placeholders.mobile')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.state')}</Label>
                            <Input {...register('state', { required: true })} placeholder={t('cropLoss.fields.state')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.district')}</Label>
                            <Input {...register('district', { required: true })} placeholder={t('cropLoss.fields.district')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.village')}</Label>
                            <Input {...register('village', { required: true })} placeholder={t('cropLoss.placeholders.village')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.area')}</Label>
                            <Input type="number" step="0.1" {...register('farmArea', { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.insurance')}</Label>
                            <Select onValueChange={(val) => setValue('insuranceStatus', val)} defaultValue="No">
                                <SelectTrigger>
                                    <SelectValue placeholder={t('cropLoss.placeholders.insurance')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">{t('cropLoss.placeholders.insYes')}</SelectItem>
                                    <SelectItem value="No">{t('cropLoss.placeholders.insNo')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Crop Details */}
                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            {t('cropLoss.sections.crop')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.cropName')}</Label>
                            <Select onValueChange={(val) => setValue('cropName', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('cropLoss.placeholders.selectCrop')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Wheat">{t('crops.wheat')}</SelectItem>
                                    <SelectItem value="Rice">{t('crops.rice')}</SelectItem>
                                    <SelectItem value="Cotton">{t('crops.cotton')}</SelectItem>
                                    <SelectItem value="Maize">{t('crops.maize')}</SelectItem>
                                    <SelectItem value="Potato">{t('crops.potato')}</SelectItem>
                                    <SelectItem value="Tomato">{t('crops.tomato')}</SelectItem>
                                    <SelectItem value="Sugarcane">{t('crops.sugarcane')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.season')}</Label>
                            <Select onValueChange={(val) => setValue('season', val)} defaultValue="Kharif">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kharif">{t('cropLoss.seasons.kharif')}</SelectItem>
                                    <SelectItem value="Rabi">{t('cropLoss.seasons.rabi')}</SelectItem>
                                    <SelectItem value="Zaid">{t('cropLoss.seasons.zaid')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.sowingDate')}</Label>
                            <Input type="date" {...register('sowingDate')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.harvestDate')}</Label>
                            <Input type="date" {...register('harvestDate')} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('cropLoss.fields.affectedArea')}</Label>
                            <Input type="number" step="0.1" {...register('affectedArea', { required: true })} />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Loss Details */}
                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            {t('cropLoss.sections.loss')}
                        </CardTitle>
                        <CardDescription>{t('cropLoss.sections.lossDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('cropLoss.fields.cause')}</Label>
                                <Select onValueChange={(val) => setValue('causeOfLoss', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('cropLoss.placeholders.selectCause')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Flood">{t('cropLoss.causes.flood')}</SelectItem>
                                        <SelectItem value="Drought">{t('cropLoss.causes.drought')}</SelectItem>
                                        <SelectItem value="Pest">{t('cropLoss.causes.pest')}</SelectItem>
                                        <SelectItem value="Disease">{t('cropLoss.causes.disease')}</SelectItem>
                                        <SelectItem value="Hailstorm">{t('cropLoss.causes.hailstorm')}</SelectItem>
                                        <SelectItem value="Heatwave">{t('cropLoss.causes.heatwave')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('cropLoss.fields.damageDate')}</Label>
                                <Input type="date" {...register('damageDate', { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('cropLoss.fields.damagePct')}</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" min="0" max="100" {...register('damagePercentage', { required: true })} />
                                    <span className="text-sm text-muted-foreground">{t('cropLoss.fields.minDamage')}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Tips */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                            <h4 className="font-semibold flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                                <span className="text-lg">💡</span> {t('cropLoss.ai.title')}
                            </h4>
                            <div className="flex flex-col gap-2 text-sm text-blue-600 dark:text-blue-400">
                                {watch('causeOfLoss') === 'Disease' && (
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        <span>{t('cropLoss.ai.uploadPhotos')}</span>
                                    </div>
                                )}
                                {watch('causeOfLoss') === 'Pest' && (
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>{t('cropLoss.ai.specifyPest')}</span>
                                    </div>
                                )}
                                {(watch('causeOfLoss') === 'Flood' || watch('causeOfLoss') === 'Hailstorm') && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{t('cropLoss.ai.gpsEnable')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Evidence */}
                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            {t('cropLoss.sections.evidence')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <div
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('evidence-upload')?.click()}
                        >
                            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium">{t('cropLoss.evidence.uploadBtn')}</p>
                            <p className="text-sm text-muted-foreground mt-1">{t('cropLoss.evidence.note')}</p>
                            <Input
                                id="evidence-upload"
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        toast.success(`${e.target.files.length} files selected`);
                                        setValue('evidence', e.target.files);
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5: Advisory Compliance */}
                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            {t('cropLoss.sections.compliance')}
                        </CardTitle>
                        <CardDescription>{t('cropLoss.advisory.title')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 mt-4">
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                            <Checkbox
                                id="compliance-fert"
                                checked={watch('advisoryCompliance.fertilizer')}
                                onCheckedChange={(val) => setValue('advisoryCompliance.fertilizer', !!val)}
                            />
                            <div>
                                <Label htmlFor="compliance-fert" className="font-medium">{t('cropLoss.compliance.adhered.fertilizer')}</Label>
                                <p className="text-xs text-muted-foreground">{t('cropLoss.advisory.verifiedNote')}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                            <Checkbox
                                id="compliance-irri"
                                checked={watch('advisoryCompliance.irrigation')}
                                onCheckedChange={(val) => setValue('advisoryCompliance.irrigation', !!val)}
                            />
                            <div>
                                <Label htmlFor="compliance-irri" className="font-medium">{t('cropLoss.compliance.adhered.irrigation')}</Label>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                            <Checkbox
                                id="compliance-pest"
                                checked={watch('advisoryCompliance.pestControl')}
                                onCheckedChange={(val) => setValue('advisoryCompliance.pestControl', !!val)}
                            />
                            <div>
                                <Label htmlFor="compliance-pest" className="font-medium">{t('cropLoss.compliance.adhered.pest')}</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 6: Declaration */}
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="declaration"
                            checked={watch('declaration')}
                            onCheckedChange={(val) => setValue('declaration', !!val)}
                        />
                        <div className="space-y-1">
                            <Label htmlFor="declaration" className="font-bold">{t('cropLoss.declaration.check')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('cropLoss.declaration.note')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/')}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" size="lg" disabled={submitting} className="bg-gradient-to-r from-green-600 to-emerald-600">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {t('cropLoss.submitBtn')}
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default CropLossForm;
