import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "app_title": "German Verb Flashcards",
          "my_sets": "My Study Sets",
          "create_set": "Create New Set",
          "no_sets": "No study sets found. Create one to start learning!",
          "verbs_count": "{{count}} verbs",
          "progress": "Progress",
          "study": "Study",
          "edit": "Edit",
          "delete": "Delete",
          "create_set_title": "Create New Study Set",
          "set_title": "Set Title",
          "set_description": "Description",
          "cancel": "Cancel",
          "create": "Create",
          "title_required": "Title is required"
        }
      },
      tr: {
        translation: {
          "app_title": "Almanca Fiil Kartları",
          "my_sets": "Çalışma Setlerim",
          "create_set": "Yeni Set Oluştur",
          "no_sets": "Çalışma seti bulunamadı. Öğrenmeye başlamak için bir tane oluşturun!",
          "verbs_count": "{{count}} fiil",
          "progress": "İlerleme",
          "study": "Çalış",
          "edit": "Düzenle",
          "delete": "Sil",
          "create_set_title": "Yeni Çalışma Seti Oluştur",
          "set_title": "Set Başlığı",
          "set_description": "Açıklama",
          "cancel": "İptal",
          "create": "Oluştur",
          "title_required": "Başlık gereklidir"
        }
      },
      de: {
        translation: {
          "app_title": "Deutsche Verben Karteikarten",
          "my_sets": "Meine Lernsets",
          "create_set": "Neues Set erstellen",
          "no_sets": "Keine Lernsets gefunden. Erstellen Sie eines, um zu beginnen!",
          "verbs_count": "{{count}} Verben",
          "progress": "Fortschritt",
          "study": "Lernen",
          "edit": "Bearbeiten",
          "delete": "Löschen",
          "create_set_title": "Neues Lernset erstellen",
          "set_title": "Set-Titel",
          "set_description": "Beschreibung",
          "cancel": "Abbrechen",
          "create": "Erstellen",
          "title_required": "Titel ist erforderlich"
        }
      }
    }
  });

export default i18n;
