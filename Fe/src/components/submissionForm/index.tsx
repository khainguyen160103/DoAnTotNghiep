"use client"
import FormSubmisstion from "../tables/FormSubmisionTable"
import { HeaderFormSubmission } from "../header/HeaderFormSubmission"
export const SubmissionForm = () => {
    return <> 
    
        <HeaderFormSubmission  options={[{ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]} handleSelectChange={(value) => console.log(value)} />
        <FormSubmisstion 
            users={[]} 
            mutate={async () => { /* Add your mutation logic here */ }} 
        />
    </>
} 