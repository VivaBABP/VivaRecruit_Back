import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetPanelDto } from './dto/get-panel.dto';

@Injectable()
export class PanelService {
  constructor(private readonly prisma: PrismaService) {}
  private async verifyIfPanelDoesntExist(
    createPanelDto: CreatePanelDto,
  ): Promise<void> {
    const panel = await this.prisma.panel.findFirst({
      where: {
        namePanel: createPanelDto.namePanel,
        interestsId: createPanelDto.interestsId,
        companyId: createPanelDto.companyId,
      },
    });
    if (!panel) throw new BadRequestException('Stand déjà existant');
  }

  private async verifyIfPanelExist(idPanel: number): Promise<void> {
    const panel = await this.prisma.panel.findFirst({
      where: {
        id: idPanel,
      },
    });
    if (!panel) throw new BadRequestException("Ce stand n'existe pas");
  }

  async create(
    createPanelDto: CreatePanelDto,
    recruit: boolean,
  ): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyIfPanelDoesntExist(createPanelDto);
    await this.prisma.panel.create({
      data: {
        namePanel: createPanelDto.namePanel,
        companyId: createPanelDto.companyId,
        interestsId: createPanelDto.interestsId,
      },
    });
  }

  async findAll(): Promise<GetPanelDto[]> {
    const panels = await this.prisma.panel.findMany({
      select: {
        namePanel: true,
        company: {
          select: {
            companyName: true,
          },
        },
        idInterest: {
          select: {
            labelInterest: true,
          },
        },
      },
    });
    const panelDto: GetPanelDto[] = [];
    panelDto.forEach((e) => {
      panelDto.push({
        companyName: e.companyName,
        interestLabel: e.interestLabel,
        panelName: e.panelName,
      });
    });
    return panelDto;
  }

  async findOne(id: number): Promise<GetPanelDto> {
    const panel = await this.prisma.panel.findFirst({
      select: {
        namePanel: true,
        company: {
          select: {
            companyName: true,
          },
        },
        idInterest: {
          select: {
            labelInterest: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
    let panelDto: GetPanelDto = null;
    panelDto = {
      companyName: panel.company.companyName,
      interestLabel: panel.idInterest.labelInterest,
      panelName: panel.namePanel,
    };
    return panelDto;
  }

  async update(
    id: number,
    updatePanelDto: UpdatePanelDto,
    recruit: boolean,
  ): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyIfPanelExist(id);
    await this.verifyIfPanelDoesntExist({
      namePanel: updatePanelDto.namePanel,
      companyId: updatePanelDto.companyId,
      interestsId: updatePanelDto.interestsId,
    });
    const interest = await this.prisma.interests.findFirst({
      where: {
        id: updatePanelDto.interestsId,
      },
    });
    if (!interest) throw new BadRequestException("C'est interêt n'existe pas.");
    const company = await this.prisma.company.findFirst({
      where: {
        id: updatePanelDto.companyId,
      },
    });
    if (!company)
      throw new BadRequestException("Cette entreprise n'existe pas");
    const panel = await this.prisma.panel.findFirst({
      where: {
        namePanel: updatePanelDto.namePanel,
      },
    });
    if (!panel) throw new BadRequestException('Ce nom de panel est déjà pris');

    await this.prisma.panel.update({
      where: { id: id },
      data: {
        namePanel: updatePanelDto.namePanel,
        companyId: updatePanelDto.companyId,
        interestsId: updatePanelDto.interestsId,
      },
    });
  }

  async remove(id: number, recruit: boolean): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyIfPanelExist(id);
    await this.prisma.panel.delete({
      where: {
        id: id,
      },
    });
  }

  async getPanelSuggestion(intestsId: number[]): Promise<GetPanelDto[]> {
    const panels = await this.prisma.panel.findMany({
      where: {
        idInterest: { id: { in: intestsId } },
      },
      select: {
        namePanel: true,
        company: {
          select: {
            companyName: true,
          },
        },
        idInterest: {
          select: {
            labelInterest: true,
          },
        },
      },
    });
    const suggestion: GetPanelDto[] = [];
    panels.forEach((e) => {
      suggestion.push({
        panelName: e.namePanel,
        interestLabel: e.idInterest.labelInterest,
        companyName: e.company.companyName,
      });
    });
    return suggestion;
  }
}
