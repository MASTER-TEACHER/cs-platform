import {
  getStudentsForSchool,
  searchStudents,
  type StudentDirectoryRecord,
} from "@/services/studentProfileService";

export type SchoolDirectoryStudent =
  StudentDirectoryRecord;

export async function getSchoolStudentDirectory(
  schoolId: string,
): Promise<SchoolDirectoryStudent[]> {
  return getStudentsForSchool(schoolId);
}

export function filterSchoolStudentDirectory(
  students: SchoolDirectoryStudent[],
  searchTerm: string,
): SchoolDirectoryStudent[] {
  return searchStudents(students, searchTerm);
}
