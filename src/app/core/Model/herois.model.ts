export interface HeroisModel {
    id: number,
    name: string,
    studio_id: number,
    power_type?: string,
    morality?: string,
    first_appearance?: string,
    release_date?: string | Date,
    creator?: string,
    weak_point?: string,
    affiliation?: string,
    story?: string,
    team_id?: number,
    genre?: string,
    image1?: string,
    image2?: string,
    // Campos mapeados para compatibilidade com o frontend
    image?: string,
    image_cover?: string
}