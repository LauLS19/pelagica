import LibrariesRow from "../components/home/LibrariesRow";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";

const Home = () => {
    return (
        <div className="flex flex-col items-start gap-6">
            <ContinueWatchingRow title="Continue Watching" />
            <LibrariesRow title="Libraries" />
        </div>
    );
};

export default Home;
