import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGUAGES = ['en', 'el'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

@Component({
    selector: 'app-language-switcher',
    imports: [MatButtonToggleModule],
    templateUrl: './language-switcher.html',
    styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
    protected readonly languages = SUPPORTED_LANGUAGES;
    private readonly translate = inject(TranslateService);

    protected get current(): SupportedLanguage {
        const lang = this.translate.getCurrentLang() ?? this.translate.getFallbackLang() ?? 'en';
        return (this.languages as readonly string[]).includes(lang) ? (lang as SupportedLanguage) : 'en';
    }

    protected change(lang: SupportedLanguage): void {
        this.translate.use(lang);
    }
}
