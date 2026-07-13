import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Menu' })
export class Menu extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;

    @Column({ type: 'varchar' })
    icon!: string;

    @Column({ type: 'varchar' })
    path!: string;

    @Column({ type: 'nvarchar' })
    text!: string;
}