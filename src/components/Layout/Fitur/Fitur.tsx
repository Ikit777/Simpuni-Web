import FiturSection from "./FiturSection"

import { fitur } from "@/data"

const Fitur: React.FC = () => {
    return (
        <div id="fitur" className="py-10 bg-background dark:bg-gray-800">
            <h2 className="sr-only">Fitur</h2>
            {fitur.map((item, index) => {
                return <FiturSection key={index} benefit={item} imageAtRight={index % 2 !== 0} />
            })}
        </div>
    )
}

export default Fitur