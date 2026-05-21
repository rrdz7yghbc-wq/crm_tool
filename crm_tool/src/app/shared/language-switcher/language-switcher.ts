import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'en' | 'el';

interface LanguageMeta {
    code: SupportedLanguage;
    flag: string;
    flagAlt: string;
    tooltipKey: string;
}

const LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
    en: { code: 'en', flag: '/assets/flags/gb.svg', flagAlt: 'United Kingdom flag', tooltipKey: 'common.switchToEnglish' },
    el: { code: 'el', flag: '/assets/flags/gr.svg', flagAlt: 'Greek flag', tooltipKey: 'common.switchToGreek' },
};

@Component({
    selector: 'app-language-switcher',
    imports: [TranslatePipe],
    templateUrl: './language-switcher.html',
    styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
    private readonly translate = inject(TranslateService);

    private readonly langChange = toSignal(this.translate.onLangChange, { initialValue: null });

    protected readonly other = computed<LanguageMeta>(() => {
        this.langChange();
        const lang = this.translate.getCurrentLang() ?? this.translate.getFallbackLang();
        const current: SupportedLanguage = lang === 'el' ? 'el' : 'en';
        return current === 'en' ? LANGUAGES.el : LANGUAGES.en;
    });

    protected toggle(): void {
        this.translate.use(this.other().code);
    }
}
