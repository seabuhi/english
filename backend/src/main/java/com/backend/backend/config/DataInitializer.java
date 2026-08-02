package com.backend.backend.config;

import com.backend.backend.model.*;
import com.backend.backend.repository.AdminUserRepository;
import com.backend.backend.repository.ExerciseRepository;
import com.backend.backend.repository.SpeakingTopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private SpeakingTopicRepository speakingTopicRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed or Update Admin User with password '23042023'
        AdminUser admin = adminUserRepository.findByUsername("admin")
                .orElseGet(() -> new AdminUser("admin", ""));
        
        admin.setPassword(passwordEncoder.encode("23042023"));
        adminUserRepository.save(admin);
        System.out.println("Admin updated/created: username=admin, password=23042023");

        // Seed Initial Exercises if database is empty
        if (exerciseRepository.count() == 0) {
            seedExercises();
            System.out.println("Initial exercise content seeded successfully!");
        }

        // Seed Speaking Topics if empty
        if (speakingTopicRepository.count() == 0) {
            seedSpeakingTopics();
            System.out.println("Initial speaking topics seeded successfully!");
        }
    }

    private void seedExercises() {
        List<Exercise> exercises = Arrays.asList(
            // --- A1 LEVEL EXERCISES ---
            new Exercise(
                "A1 Daily Routine - Reading Passage",
                CefrLevel.A1, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "My name is Sarah. I get up at 7:00 AM every morning. First, I drink a cup of warm tea and eat toast. At 8:00 AM, I walk to the nearby bus stop and take bus number 12 to work. I work in a small flower shop in London. I love colorful roses and tulips. In the evening, I return home, cook pasta for dinner, and read a book before sleeping at 10:30 PM.",
                null, null, null,
                "What time does Sarah wake up in the morning?",
                "[\"6:30 AM\", \"7:00 AM\", \"8:00 AM\", \"10:30 PM\"]",
                "7:00 AM",
                "The text explicitly mentions: 'I get up at 7:00 AM every morning.'"
            ),
            new Exercise(
                "A1 Daily Routine - True/False",
                CefrLevel.A1, Category.READING, ExerciseType.TRUE_FALSE,
                "My name is Sarah. I get up at 7:00 AM every morning. First, I drink a cup of warm tea and eat toast. At 8:00 AM, I walk to the nearby bus stop and take bus number 12 to work. I work in a small flower shop in London.",
                null, null, null,
                "Sarah goes to work by car.",
                "[\"True\", \"False\"]",
                "False",
                "The text states Sarah walks to the bus stop and takes bus number 12, not a car."
            ),
            new Exercise(
                "A1 Meeting New Friends - Listening",
                CefrLevel.A1, Category.LISTENING, ExerciseType.MULTIPLE_CHOICE,
                null, "/uploads/audio/a1_sample.mp3", null,
                "Transcript: Hello! My name is David. I am 24 years old and I come from Canada. I live in Toronto. I enjoy playing guitar and playing soccer on weekends with my brothers.",
                "Where is David originally from?",
                "[\"England\", \"Australia\", \"Canada\", \"USA\"]",
                "Canada",
                "David introduces himself: 'I come from Canada.'"
            ),
            new Exercise(
                "A1 Basic Vocabulary - Fruits & Foods",
                CefrLevel.A1, Category.VOCABULARY, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Which word means a yellow fruit that monkeys love to eat?",
                "[\"Apple\", \"Banana\", \"Grape\", \"Orange\"]",
                "Banana",
                "A banana is a yellow, curved tropical fruit."
            ),
            new Exercise(
                "A1 Synonyms - Happy",
                CefrLevel.A1, Category.SYNONYMS_ANTONYMS, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Choose the synonym (same meaning) for the word 'HAPPY':",
                "[\"Glad\", \"Sad\", \"Angry\", \"Tired\"]",
                "Glad",
                "'Glad' and 'happy' both express a feeling of pleasure and contentment."
            ),
            new Exercise(
                "A1 Antonyms - Big",
                CefrLevel.A1, Category.SYNONYMS_ANTONYMS, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Choose the antonym (opposite meaning) for the word 'BIG':",
                "[\"Large\", \"Huge\", \"Small\", \"Tall\"]",
                "Small",
                "'Small' is the exact opposite of 'Big'."
            ),
            new Exercise(
                "A1 Grammar - Present Simple 'To Be'",
                CefrLevel.A1, Category.GRAMMAR, ExerciseType.FILL_IN_BLANK,
                null, null, null, null,
                "Fill in the blank: She _____ a student at Cambridge University.",
                "[\"am\", \"is\", \"are\", \"be\"]",
                "is",
                "The third person singular pronoun 'She' requires the verb form 'is'."
            ),

            // --- A2 LEVEL EXERCISES ---
            new Exercise(
                "A2 Travel & Vacation - Reading",
                CefrLevel.A2, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "Last summer, Tom and his family visited Barcelona for two weeks. They stayed at a cozy hotel near the Mediterranean beach. Every morning they ate fresh croissants and drank orange juice at a seaside cafe. They spent their days visiting historical sites like Sagrada Família and walking through Park Güell. Tom took over 500 photos during the trip.",
                null, null, null,
                "How long did Tom's family stay in Barcelona?",
                "[\"One week\", \"Two weeks\", \"One month\", \"Three days\"]",
                "Two weeks",
                "The passage states: 'visited Barcelona for two weeks.'"
            ),
            new Exercise(
                "A2 Grammar - Past Simple Irregular Verbs",
                CefrLevel.A2, Category.GRAMMAR, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Choose the correct past simple verb: Yesterday, I _____ a wonderful movie at the cinema.",
                "[\"see\", \"saw\", \"seen\", \"seeing\"]",
                "saw",
                "'Saw' is the past simple form of the irregular verb 'see'."
            ),
            new Exercise(
                "A2 Vocabulary - Hobbies & Leisure",
                CefrLevel.A2, Category.VOCABULARY, ExerciseType.FILL_IN_BLANK,
                null, null, null, null,
                "I love photography. My father bought me a new digital _____ for my birthday.",
                "[\"laptop\", \"camera\", \"guitar\", \"bicycle\"]",
                "camera",
                "A camera is the device used for photography."
            ),

            // --- B1 LEVEL EXERCISES ---
            new Exercise(
                "B1 Technology in Education - Reading",
                CefrLevel.B1, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "Digital technology has revolutionized high school education over the last decade. Interactive whiteboards, tablet computers, and online learning portals allow students to access global educational resources instantly. While some educators worry about digital distractions during lectures, research shows that interactive multimedia tools increase student engagement by 35% compared to traditional textbooks.",
                null, null, null,
                "What is the main finding regarding interactive multimedia tools?",
                "[\"They replace teachers completely\", \"They cause severe distraction in 35% of classes\", \"They boost student engagement by 35%\", \"They are cheaper than paper books\"]",
                "They boost student engagement by 35%",
                "The article states that research shows interactive multimedia tools increase student engagement by 35%."
            ),
            new Exercise(
                "B1 Grammar - Present Perfect vs Past Simple",
                CefrLevel.B1, Category.GRAMMAR, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Select the correct sentence:",
                "[\"I have visited Paris in 2019.\", \"I visited Paris in 2019.\", \"I visit Paris in 2019.\", \"I am visiting Paris in 2019.\"]",
                "I visited Paris in 2019.",
                "We use the Past Simple ('visited') when a specific finished time in the past ('in 2019') is mentioned."
            ),
            new Exercise(
                "B1 Synonyms - Essential",
                CefrLevel.B1, Category.SYNONYMS_ANTONYMS, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Select the word closest in meaning to 'ESSENTIAL':",
                "[\"Crucial\", \"Optional\", \"Minor\", \"Secondary\"]",
                "Crucial",
                "'Crucial' and 'Essential' both mean extremely important or necessary."
            ),

            // --- B2 LEVEL EXERCISES ---
            new Exercise(
                "B2 Environmental Sustainability - Reading",
                CefrLevel.B2, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "The shift toward renewable energy sources—such as solar, wind, and hydroelectric power—is accelerating globally as governments strive to reach net-zero carbon emission targets. However, integrating intermittent renewable power into traditional electrical grids poses technical hurdles. Energy storage technologies, particularly utility-scale lithium-ion and flow batteries, are critical to smoothing supply fluctuations and ensuring grid stability during peak demand periods.",
                null, null, null,
                "Why are energy storage technologies essential for renewable power grids?",
                "[\"To increase electricity costs\", \"To smooth supply fluctuations caused by intermittent sources\", \"To eliminate the need for wind turbines\", \"To replace traditional solar panels\"]",
                "To smooth supply fluctuations caused by intermittent sources",
                "The text explicitly highlights that storage tech is critical to 'smoothing supply fluctuations and ensuring grid stability'."
            ),
            new Exercise(
                "B2 Grammar - Conditionals (Third Conditional)",
                CefrLevel.B2, Category.GRAMMAR, ExerciseType.FILL_IN_BLANK,
                null, null, null, null,
                "If we _____ (leave) home ten minutes earlier, we would not have missed the express train.",
                "[\"left\", \"had left\", \"would leave\", \"have left\"]",
                "had left",
                "Third conditional structure for unreal past situations: If + past perfect ('had left'), would + have + past participle."
            ),

            // --- C1 LEVEL EXERCISES ---
            new Exercise(
                "C1 Linguistic Diversity - Reading",
                CefrLevel.C1, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "Linguistic erosion is progressing at an unprecedented pace, with linguists estimating that nearly half of the world's 7,000 spoken languages may succumb to extinction by the turn of the century. Language loss entails not merely the vanishing of lexical items, but the irrevocable forfeiture of unique epistemological frameworks, ecological knowledge, and oral histories embedded within indigenous vernaculars.",
                null, null, null,
                "What does the passage imply is lost when a language goes extinct?",
                "[\"Only printed dictionaries\", \"Unique epistemological frameworks and ecological wisdom\", \"International trade agreements\", \"Modern grammatical software\"]",
                "Unique epistemological frameworks and ecological wisdom",
                "The text highlights the loss of 'unique epistemological frameworks, ecological knowledge, and oral histories'."
            ),
            new Exercise(
                "C1 Advanced Vocabulary - Nuances",
                CefrLevel.C1, Category.VOCABULARY, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "The diplomat handled the delicate negotiations with remarkable _____, defusing tension before any disputes could arise.",
                "[\"finesse\", \"clumsiness\", \"indifference\", \"hesitation\"]",
                "finesse",
                "'Finesse' refers to impressive delicacy, skill, and tact in handling difficult situations."
            ),

            // --- C2 LEVEL EXERCISES ---
            new Exercise(
                "C2 Philosophical Discourse - Reading",
                CefrLevel.C2, Category.READING, ExerciseType.MULTIPLE_CHOICE,
                "In epistemology, the Gettier problem challenges the longstanding classic definition of knowledge as 'justified true belief' (JTB). Edmund Gettier demonstrated via ingenious thought experiments that an individual can hold a belief that is both true and supported by evidence, yet still fail to possess genuine knowledge because the belief's truth stems fortuitously from unexamined coincidences.",
                null, null, null,
                "What core assumption of traditional epistemology does Gettier dismantle?",
                "[\"That truth is objective\", \"That belief is unnecessary for knowledge\", \"That justified true belief is always sufficient for knowledge\", \"That thought experiments are invalid\"]",
                "That justified true belief is always sufficient for knowledge",
                "Gettier proved that JTB is not sufficient for knowledge because luck or coincidence can create true justified beliefs without real knowledge."
            ),
            new Exercise(
                "C2 Inversion & Advanced Structure",
                CefrLevel.C2, Category.GRAMMAR, ExerciseType.MULTIPLE_CHOICE,
                null, null, null, null,
                "Seldom _____ such an inspiring manifestation of resilience and solidarity in times of crisis.",
                "[\"we have witnessed\", \"have we witnessed\", \"we witnessed\", \"did we witnessing\"]",
                "have we witnessed",
                "Negative adverbials like 'Seldom' placed at the start of a sentence require inverted word order (auxiliary verb before subject: 'have we witnessed')."
            )
        );

        exerciseRepository.saveAll(exercises);
    }

    private void seedSpeakingTopics() {
        List<SpeakingTopic> topics = Arrays.asList(
            new SpeakingTopic(
                "Introducing Yourself & Your Family",
                CefrLevel.A1,
                "Practice basic English introductions, telling others about your age, country, hobbies, and family members.",
                "[\"What is your name and where are you from?\", \"Can you describe your family members?\", \"What is your favorite daily routine?\"]",
                "[\"What time do you usually have breakfast?\", \"What hobbies do you enjoy on Sundays?\"]"
            ),
            new SpeakingTopic(
                "Hobbies, Travel & Favorite Food",
                CefrLevel.A2,
                "Discuss your leisure activities, memorable vacation trips, and favorite international dishes.",
                "[\"Describe a city or country you visited recently.\", \"What kind of food do you like to order at restaurants?\", \"What is your favorite weekend activity?\"]",
                "[\"How do you prefer to travel: by plane, train, or car? Why?\", \"Do you like cooking at home?\"]"
            ),
            new SpeakingTopic(
                "Education, Work & Technology",
                CefrLevel.B1,
                "Share your opinions on modern career choices, online learning, and smartphone technology.",
                "[\"How has technology changed the way you study or work?\", \"What skills do you think are most important for future jobs?\", \"Do you prefer remote work or working in an office?\"]",
                "[\"What are the main advantages and disadvantages of social media?\"]"
            ),
            new SpeakingTopic(
                "Society, Environment & Culture",
                CefrLevel.B2,
                "Engage in structured discussions on environmental protection, cultural heritage, and community challenges.",
                "[\"What steps can individuals take to reduce plastic waste in their cities?\", \"How does tourism impact local cultural traditions?\", \"Should public transport be free for everyone?\"]",
                "[\"How can governments encourage renewable energy adoption?\"]"
            ),
            new SpeakingTopic(
                "Ethics, Innovation & Artificial Intelligence",
                CefrLevel.C1,
                "Formulate persuasive arguments regarding ethical dilemmas in emerging artificial intelligence technologies.",
                "[\"Will automation enhance or diminish human quality of life over the coming decades?\", \"To what extent should governments regulate algorithms and data privacy?\", \"Can machine intelligence ever truly possess creative intuition?\"]",
                "[\"What ethical standards should guide scientific innovation?\"]"
            ),
            new SpeakingTopic(
                "Global Economics & Philosophical Debates",
                CefrLevel.C2,
                "Deliver articulate, nuanced oral presentations on complex global macroeconomic strategies and philosophy.",
                "[\"Critically evaluate the tension between economic growth and ecological preservation in developing nations.\", \"Does language shape our perception of reality, or merely reflect it?\", \"How can international institutions resolve conflicting geopolitical interests?\"]",
                "[\"What defines a successful civilization in the 21st century?\"]"
            )
        );

        speakingTopicRepository.saveAll(topics);
    }
}
