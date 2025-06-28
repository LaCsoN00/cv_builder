"use client"

import React from "react";
import { useEffect, useRef, useState } from "react";
import { Eye, RotateCw, Save } from "lucide-react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from "@/type";
import { educationsPreset, experiencesPreset, hobbiesPreset, languagesPreset, personalDetailsPreset, skillsPreset } from "@/presets";
import CVPreview from "./components/CVPreview";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import EducationForm from "./components/EducationForm";
import ExperienceForm from "./components/ExperienceForm";
import LanguageForm from "./components/LanguageForm";
import SkillForm from "./components/SkillForm";
import HobbyForm from "./components/HobbyForm";

const Home = () => {
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(personalDetailsPreset);
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<string>('cupcake');
  const [zoom, setZoom] = useState<number>(163);
  const [experiences, setExperience] = useState<Experience[]>(experiencesPreset);
  const [educations, setEducations] = useState<Education[]>(educationsPreset);
  const [languages, setLanguages] = useState<Language[]>(languagesPreset);
  const [skills, setSkills] = useState<Skill[]>(skillsPreset);
  const [hobbies, setHobbies] = useState<Hobby[]>(hobbiesPreset);

  const handleResetExperiences = () => setExperience([]);
  const handleResetEducations = () => setEducations([]);
  const handleResetLanguages = () => setLanguages([]);
  const handleResetSkills = () => setSkills([]);
  const handleResetHobbies = () => setHobbies([]);
  const handleResetPersonalDetails = () => setPersonalDetails(personalDetailsPreset);

  const handleDownloadPdf = async () => {
    try {
      // Créer un style pour l'impression
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          /* Masquer tout sauf le CV */
          body > *:not(#print-content) {
            display: none !important;
          }
          /* Style du CV pour l'impression */
          #print-content {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          #print-content .cv-preview {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            box-shadow: none;
            transform: none !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            background: white;
          }
          /* S'assurer que les couleurs sont imprimées */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          /* Masquer les éléments non nécessaires */
          .no-print {
            display: none !important;
          }
          /* S'assurer qu'il n'y a pas de débordement */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: white;
          }
        }
      `;
      document.head.appendChild(style);

      // Créer un conteneur temporaire pour l'impression
      const printContainer = document.createElement('div');
      printContainer.id = 'print-content';
      const cvClone = cvPreviewRef.current?.cloneNode(true) as HTMLElement;
      if (cvClone) {
        // S'assurer que le clone conserve tous les styles
        cvClone.style.width = '210mm';
        cvClone.style.minHeight = '297mm';
        cvClone.style.maxWidth = '210mm';
        cvClone.style.margin = '0';
        cvClone.style.padding = '20mm';
        cvClone.style.backgroundColor = 'white';
        cvClone.style.position = 'relative';
        cvClone.style.left = '0';
        cvClone.style.top = '0';
        cvClone.style.transform = 'none';
        cvClone.style.overflow = 'hidden';

        printContainer.appendChild(cvClone);
        document.body.appendChild(printContainer);

        // Sauvegarder le titre actuel
        const originalTitle = document.title;
        document.title = `${personalDetails.fullName || 'cv'}.pdf`;

        // Imprimer
        window.print();

        // Nettoyer
        document.body.removeChild(printContainer);
        document.head.removeChild(style);
        document.title = originalTitle;

        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if(modal) modal.close();

        confetti({
          particleCount: 100,
          spread: 70,
          origin: {y: 0.6},
          zIndex: 9999
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <div className="hidden lg:block">
        <section className="flex items-center h-screen">
          <div className="w-1/3 h-full p-10 bg-base-200 scrollable no-scrollbar">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold italic">
                CV
                <span className="text-primary">Builder</span>
              </h1>

              <button 
                className="btn btn-primary" 
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
              >
                Prévisualiser
                <Eye className="w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 rounded-lg">
              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Qui êtes-vous ?</h1>
                <button
                  onClick={handleResetPersonalDetails}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <PersonalDetailsForm
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                setFile={setFile}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Expériences</h1>
                <button
                  onClick={handleResetExperiences}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <ExperienceForm
                experience={experiences}
                setExperiences={setExperience}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Formations</h1>
                <button
                  onClick={handleResetEducations}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <EducationForm
                educations={educations}
                setEducations={setEducations}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Langues</h1>
                <button
                  onClick={handleResetLanguages}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <LanguageForm
                languages={languages}
                setLanguages={setLanguages}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Compétences</h1>
                <button
                  onClick={handleResetSkills}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <SkillForm
                skills={skills}
                setSkills={setSkills}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Hobbies</h1>
                <button
                  onClick={handleResetHobbies}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCw className="w-4" />
                </button>
              </div>

              <HobbyForm
                hobbies={hobbies}
                setHobbies={setHobbies}
              />
            </div>
          </div>

          <div className="w-2/3 h-full bg-base-100 bg-[url('/file.svg')] bg-cover bg-center scrollable-preview relative">
            <div className="flex items-center justify-center fixed z-[9999] top-5 right-5">
              <input
                type="range"
                min={50}
                max={200}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="range range-xs range-primary"
              />
              <p className="ml-4 text-sm text-primary">{zoom}%</p>
            </div>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="select select-bordered fixed z-[9999] select-sm top-12 right-5"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="cupcake">Cupcake</option>
              <option value="bumblebee">Bumblebee</option>
              <option value="emerald">Emerald</option>
              <option value="corporate">Corporate</option>
              <option value="synthwave">Synthwave</option>
              <option value="retro">Retro</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="valentine">Valentine</option>
              <option value="halloween">Halloween</option>
              <option value="garden">Garden</option>
              <option value="forest">Forest</option>
              <option value="aqua">Aqua</option>
              <option value="lofi">Lo-Fi</option>
              <option value="pastel">Pastel</option>
              <option value="fantasy">Fantasy</option>
              <option value="wireframe">Wireframe</option>
              <option value="black">Black</option>
              <option value="luxury">Luxury</option>
              <option value="dracula">Dracula</option>
              <option value="cmyk">CMYK</option>
              <option value="autumn">Autumn</option>
              <option value="business">Business</option>
              <option value="acid">Acid</option>
              <option value="lemonade">Lemonade</option>
              <option value="night">Night</option>
              <option value="coffee">Coffee</option>
              <option value="winter">Winter</option>
              <option value="dim">Dim</option>
              <option value="nord">Nord</option>
              <option value="sunset">Sunset</option>
            </select>

            <div
              className="flex justify-center items-center"
              style={{
                transform: `scale(${zoom / 200})`
              }}
            >
              <CVPreview
                personalDetails={personalDetails}
                file={file}
                theme={theme}
                experiences={experiences}
                educations={educations}
                languages={languages}
                hobbies={hobbies}
                skills={skills}
              />
            </div>
          </div>
        </section>

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[90vh]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div className="mt-5 h-full flex flex-col">
              <div className="flex justify-end mb-5">
                <button onClick={handleDownloadPdf} className="btn btn-primary">
                  Télécharger
                  <Save className='w-4' />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex justify-center items-start bg-base-200 p-4 rounded-lg">
                <div className="bg-white shadow-lg rounded-lg p-8">
                  <CVPreview
                    personalDetails={personalDetails}
                    file={file}
                    theme={theme}
                    experiences={experiences}
                    educations={educations}
                    languages={languages}
                    hobbies={hobbies}
                    skills={skills}
                    download={true}
                    ref={cvPreviewRef}
                  />
                </div>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>

      <div className="lg:hidden">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">Désolé, le CV Builder est uniquement accessible sur ordinateur.</h1>
              <Image
                src="/sad-sorry.gif"
                width={500}
                height={500}
                alt="Picture of the author"
                className="mx-auto my-6"
                unoptimized
              />
              <p className="py-6">
                Pour créer et personnaliser votre CV, veuillez utiliser un ordinateur. Nous vous remercions de votre compréhension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 